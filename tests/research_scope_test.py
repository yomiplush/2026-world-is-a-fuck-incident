import copy, importlib.util, json, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('research_scope',ROOT/'tools/research_scope.py')
scope=importlib.util.module_from_spec(spec);spec.loader.exec_module(scope)
class ScopeTests(unittest.TestCase):
 def setUp(self):
  self.path=ROOT/'data'/json.loads((ROOT/'data/latest.json').read_text())['incident_register']
  self.register=json.loads(self.path.read_text());self.audit=json.loads((ROOT/'content/research-scope.json').read_text())
 def test_current_partition_and_exceptions(self):
  groups=scope.groups(self.register,self.path,self.audit)
  self.assertEqual([len(rows) for _,rows in groups],[162,4,2,0])
  decisions=scope.decisions(self.register,self.path,self.audit)
  self.assertEqual(decisions['unm-recovery']['scope'],'regional')
  self.assertEqual(decisions['yamaha-nwr100']['scope'],'global')
 def test_new_snapshot_is_unreviewed(self):
  audit=copy.deepcopy(self.audit);audit['register_sha256']='stale'
  self.assertTrue(all(x['scope']=='unresolved' for x in scope.decisions(self.register,self.path,audit).values()))
 def test_incomplete_matching_audit_is_rejected(self):
  audit=copy.deepcopy(self.audit);audit['records'].pop(next(iter(audit['records'])))
  with self.assertRaises(ValueError):scope.decisions(self.register,self.path,audit)
 def test_unsupported_source_is_rejected(self):
  audit=copy.deepcopy(self.audit);next(iter(audit['records'].values()))['sources']=['https://example.invalid/']
  with self.assertRaises(ValueError):scope.decisions(self.register,self.path,audit)
 def test_bilingual_pages_preserve_ids_and_partition(self):
  from html.parser import HTMLParser
  class Page(HTMLParser):
   def __init__(self,text):
    super().__init__();self.section=None;self.sections={};self.ids=[];self.links=[];self.feed(text)
   def handle_starttag(self,tag,attrs):
    a=dict(attrs)
    if a.get('id'):self.ids.append(a['id'])
    if tag=='section':
     self.section=a.get('id')
     if self.section and self.section.startswith('scope-'):self.sections[self.section]=[]
    if tag=='article' and self.section in self.sections:self.sections[self.section].append(a['id'])
    if tag=='a':self.links.append(a.get('href',''))
  expected={r['id'] for r in self.register['records']}
  pages=[Page((ROOT/'site'/name).read_text()) for name in ('database.html','database.en.html')]
  for page in pages:
   self.assertEqual(len(page.ids),len(set(page.ids)))
   self.assertEqual(set(sum(page.sections.values(),[])),expected)
   self.assertEqual([len(x) for x in page.sections.values()],[162,4,2,0])
   self.assertTrue(all(link[1:] in page.ids for link in page.links if link.startswith('#')))
  self.assertEqual(pages[0].sections,pages[1].sections)
 def test_download_keeps_original_records_unchanged(self):
  public=json.loads((ROOT/'site/data/latest.json').read_text())
  self.assertEqual(public['records'],self.register['records'])
  self.assertEqual(public['research_scope'],self.audit['records'])

 def test_stale_export_does_not_claim_old_review(self):
  audit=copy.deepcopy(self.audit);audit['register_sha256']='stale'
  exported=scope.export(self.register,self.path,audit)
  self.assertEqual(exported['status'],'pending')
  self.assertIsNone(exported['reviewed_at'])
  self.assertEqual(exported['snapshot'],self.path.parent.name)
  self.assertNotEqual(exported['register_sha256'],'stale')
