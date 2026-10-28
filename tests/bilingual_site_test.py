import json,re,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.lang=None;self.codes=[];self.alternates=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='option' and a.get('data-code'):self.codes.append(a['data-code'])
  if tag=='link' and a.get('hreflang'):self.alternates.append(a['hreflang'])
class BilingualSite(unittest.TestCase):
 def test_public_catalog_and_every_page_offer_only_japanese_and_english(self):
  rows=json.loads((ROOT/'content/site-languages.json').read_text())['languages']
  self.assertEqual([r['code'] for r in rows],['en','ja'])
  for path in (ROOT/'site').rglob('*.html'):
   with self.subTest(path=path.name):
    p=Page(path.read_text());self.assertIn(p.lang,['ja','en'])
    self.assertTrue(set(p.codes)<={'ja','en'},p.codes)
    self.assertTrue(set(p.alternates)<={'ja','en','x-default'},p.alternates)
 def test_unsupported_public_locale_artifacts_are_removed(self):
  for path in (ROOT/'site').rglob('*'):
   m=re.search(r'(?:^|\.|locale-)(ar|de|es|fr|hi|id|ko|pl|pt|ru|sv|uk|zh)(?:-[a-f0-9]{12})?\.(?:html|json|js)$',path.name)
   if m:self.assertIn(m[1],['ja','en'],str(path))
  manifest=json.loads((ROOT/'site/assets/manifest.json').read_text())
  self.assertFalse(any(k.startswith('locale-') for k in manifest['current']))
 def test_language_directory_describes_the_two_supported_languages(self):
  text=(ROOT/'site/languages.html').read_text()
  self.assertNotIn('追補画面は英語表示の場合',text)
  self.assertNotIn('ウクライナ語',text)
  self.assertIn('日本語とEnglish',text)
if __name__=='__main__':unittest.main()
