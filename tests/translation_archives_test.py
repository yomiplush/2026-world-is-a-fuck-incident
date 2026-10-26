"""Archive selection checks without running the site generator or writing generated pages."""
import ast,importlib.util,json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('manager',ROOT/'tools/translations/manage.py');manager=importlib.util.module_from_spec(spec);spec.loader.exec_module(manager)
tree=ast.parse((ROOT/'tools/build-languages.py').read_text())
helper=next(node for node in tree.body if isinstance(node,ast.FunctionDef) and node.name=='validated_archive')
namespace={'json':json};exec(compile(ast.Module(body=[helper],type_ignores=[]),'<archive selector>','exec'),namespace)
select=namespace['validated_archive']
class TranslationArchives(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
  self.root=Path(self.tmp.name);self.store=self.root/'data/translations';self.store.mkdir(parents=True)
  for name,value in [('ROOT',self.root),('STORE',self.store)]:
   ctx=patch.object(manager,name,value);ctx.start();self.addCleanup(ctx.stop)
  self.current={'snapshot':'2026-10-27-0747'}
 def package(self,snapshot):
  folder=self.store/snapshot;folder.mkdir()
  raw=json.dumps({'records':[],'caveats':[],'cutoff_jst':snapshot})
  register=self.root/'data'/('register-'+snapshot+'.json');register.write_text(raw)
  strings={'ui.title':'これは保存された調査データベースの日本語原文です。'}
  source={'snapshot':snapshot,'register':register.name,'register_hash':manager.sha(raw),'source_hash':manager.sha(json.dumps(strings,ensure_ascii=False,sort_keys=True)),'strings':strings}
  package={'snapshot':snapshot,'locale':'en','status':'translated','source_hash':source['source_hash'],'register_hash':source['register_hash'],'strings':{'ui.title':'Archived incident database'}}
  (folder/'source.json').write_text(json.dumps(source));(folder/'en.json').write_text(json.dumps(package))
  return folder,register
 def test_selects_newest_verified_archive_and_preserves_its_date(self):
  self.package('2026-10-26-2135');self.package('2026-10-27-0018')
  source,package,record,path=select(manager,self.current,'en')
  self.assertEqual(source['snapshot'],'2026-10-27-0018');self.assertEqual(record['cutoff_jst'],source['snapshot']);self.assertEqual(path.parent.name,source['snapshot'])
 def test_changed_register_is_rejected_and_older_valid_archive_used(self):
  self.package('2026-10-26-2135');_,register=self.package('2026-10-27-0018');register.write_text('{}')
  self.assertEqual(select(manager,self.current,'en')[0]['snapshot'],'2026-10-26-2135')
 def test_hash_mismatch_and_other_language_cannot_be_published(self):
  folder,_=self.package('2026-10-27-0018');path=folder/'en.json';package=json.loads(path.read_text());package['source_hash']='wrong';path.write_text(json.dumps(package))
  self.assertIsNone(select(manager,self.current,'en'))
  self.assertIsNone(select(manager,self.current,'uk'))
 def test_current_snapshot_is_never_an_archive(self):
  self.package(self.current['snapshot']);self.assertIsNone(select(manager,self.current,'en'))
if __name__=='__main__':unittest.main()
