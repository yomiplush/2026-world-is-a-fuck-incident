"""Impact locale validation must reject English copies and remove stale public files."""
import importlib.util,json,shutil,tempfile,unittest
from pathlib import Path
from types import SimpleNamespace
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('impact_pages',ROOT/'tools/impact_pages.py');views=importlib.util.module_from_spec(spec);spec.loader.exec_module(views)
class ImpactLocales(unittest.TestCase):
 def test_rejects_english_fallback_and_removes_stale_artifacts(self):
  with tempfile.TemporaryDirectory()as directory:
   root=Path(directory);latest=json.loads((ROOT/'data/latest.json').read_text());snapshot=latest['impact_register'].split('/')[0]
   (root/'tools/translations').mkdir(parents=True);shutil.copy(ROOT/'tools/translations/manage.py',root/'tools/translations/manage.py')
   (root/'content').mkdir();shutil.copy(ROOT/'content/site-languages.json',root/'content/site-languages.json')
   source=root/'data/impact-translations'/snapshot;source.mkdir(parents=True)
   for name in ['source.json','ja.json','en.json']:shutil.copy(ROOT/'data/impact-translations'/snapshot/name,source/name)
   target=root/'data'/latest['impact_register'];target.parent.mkdir(parents=True);shutil.copy(ROOT/'data'/latest['impact_register'],target)
   copy=json.loads((source/'en.json').read_text());copy['locale']='fr';(source/'fr.json').write_text(json.dumps(copy))
   # A different database English store must not weaken impact validation.
   db=root/'data/translations'/snapshot;db.mkdir(parents=True);(db/'en.json').write_text('{"strings":{}}')
   self.assertIsNone(views.locale_package(root,latest,'fr'))
   (root/'site/data').mkdir(parents=True)
   stale=[root/'site/impact.fr.html',root/'site/data/impact.fr.json']
   for p in stale:p.write_text('obsolete')
   def shell(title,description,body):return '<html lang="ja"><head></head><body><main><nav class="global"></nav>'+body+'</main></body></html>'
   import html
   pub=SimpleNamespace(ROOT=root,LATEST=latest,BASE='https://example.org/',shell=shell,esc=lambda x:html.escape(str(x),quote=True),metadata=lambda p,t:t,language_select=lambda *a:'<select></select>')
   self.assertEqual(views.publish_locales(pub),2)
   for p in stale:self.assertFalse(p.exists(),str(p))
if __name__=='__main__':unittest.main()
