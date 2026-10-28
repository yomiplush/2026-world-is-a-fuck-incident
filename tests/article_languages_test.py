import importlib.util
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('article_languages',ROOT/'tools/article_languages.py')
class ArticleLanguages(unittest.TestCase):
 def test_complete_translation_preserves_markup_and_numbers(self):
  module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  raw='<html lang="ja"><title>影響一覧</title><p>被害は16件。<a href="https://example.org/CVE-2026-1234">一次資料</a></p><script>const a="翻訳しない";</script><select><option>日本語</option></select></html>'
  strings=module.extract(raw)
  self.assertNotIn('翻訳しない',strings.values());self.assertNotIn('日本語',strings.values())
  values={module.key(k):v for k,v in [('影響一覧','Impact list'),('被害は16件。','16 cases were affected.'),('一次資料','Primary source')]}
  out=module.render(raw,values)
  self.assertIn('16 cases',out);self.assertIn('href="https://example.org/CVE-2026-1234"',out);self.assertIn('const a="翻訳しない"',out)
  with self.assertRaises(ValueError):module.render(raw,{})
  with self.assertRaises(ValueError):module.render(raw,{**values,module.key('被害は16件。'):'15 cases were affected.'})

 def test_published_companions_and_identity(self):
  import json,re
  from html.parser import HTMLParser
  class Head(HTMLParser):
   def __init__(self,raw):super().__init__();self.alternates={};self.canonicals=[];self.feed(raw)
   def handle_starttag(self,tag,attrs):
    attrs=dict(attrs)
    if tag=='link' and attrs.get('hreflang'):
     self.alternates.setdefault(attrs['hreflang'],[]).append(attrs['href'])
    if tag=='link' and attrs.get('rel')=='canonical':self.canonicals.append(attrs['href'])
  source=json.loads((ROOT/'data/article-translations/source.json').read_text())
  for relative in list(source['pages'])+['briefing.html']:
   path=ROOT/'site'/relative;en=path.with_name(path.stem+'.en.html')
   self.assertTrue(en.is_file(),relative)
   text=en.read_text();head=Head(text)
   self.assertRegex(text,r'<html\b[^>]*lang="en"')
   self.assertIn('select data-language-navigation',text)
   self.assertEqual(len(head.alternates.get('ja',[])),1,relative)
   self.assertEqual(len(head.alternates.get('en',[])),1,relative)
   self.assertNotEqual(head.alternates['ja'],head.alternates['en'])
   self.assertEqual(head.canonicals,head.alternates['en'])

if __name__=='__main__':unittest.main()
