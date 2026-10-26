import importlib.util,json,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('translations',ROOT/'tools/translations/manage.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class TranslationMemory(unittest.TestCase):
 def test_protects_identifiers_numbers_adjacent_to_japanese(self):
  text='対象は345契約。Frappe1.36.1とv16.36.1、CVE-2026-115560。次は23:00 JST。'
  protected,tokens=m.protect(text)
  for value in ['345','1.36.1','v16.36.1','CVE-2026-115560','23:00']:self.assertIn(value,tokens)
  self.assertEqual(m.restore(protected,tokens),text)
  with self.assertRaises(ValueError):m.restore(protected.replace('__KEEP_000__',''),tokens)
 def test_source_copies_and_modified_numbers_are_rejected(self):
  source={'strings':{'body':'345契約が対象です。','title':'サービスの案内'},'string_hashes':{}}
  with self.assertRaises(ValueError):m.validate(source,source['strings'],'fr')
  with self.assertRaises(ValueError):m.validate(source,{'body':'346 contrats.','title':'Avis de service'},'fr')
  m.validate(source,{'body':'345 contrats.','title':'Avis de service'},'fr')
 def test_metadata_correction_marks_package_stale_without_discarding_text_memory(self):
  source={'source_hash':'same-strings','register_hash':'corrected-register'}
  self.assertFalse(m.is_current(source,{'source_hash':'same-strings','register_hash':'old-register'}))
  self.assertTrue(m.is_current(source,dict(source)))
 def test_ghsa_word_hyphen_is_not_an_advisory_identifier(self):
  self.assertTrue(m.valid_string('GHSA公開111件。','111 GHSA-inskrywings.'))
  self.assertFalse(m.valid_string('GHSA-abcd-2345-efgh','GHSA-abcd-2345-zzzz'))
 def test_stored_database_retains_all_ids_sources_and_classifications(self):
  source,targets=m.prepare();register=json.loads((ROOT/'data'/source['register']).read_text())
  for path in (m.STORE/source['snapshot']).glob('*.json'):
   package=json.loads(path.read_text())
   if package.get('status') not in ('source','translated'):continue
   self.assertTrue(m.is_current(source,package));m.validate(source,package['strings'],package['locale'])
   self.assertEqual(len(package['database']['records']),len(register['records']))
   for original,translated in zip(register['records'],package['database']['records']):
    for field in original:
     if field not in ('title','body','action','time'):self.assertEqual(original[field],translated[field])
 def test_locales_are_explicitly_incomplete_until_real_data_exists(self):
  p=ROOT/'data/translations/2026-10-26-2135/manifest.json';manifest=json.loads(p.read_text())
  self.assertEqual(manifest['target_count'],len(json.loads((ROOT/'content/site-languages.json').read_text())['languages']))
  for code,row in manifest['languages'].items():
   if row['status']in('source','translated'):
    package=json.loads((ROOT/row['file']).read_text());self.assertEqual(package['source_hash'],manifest['source_hash']);self.assertTrue(package['strings'])
if __name__=='__main__':unittest.main()
