import json,re,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.options=[];self.canonical=[];self.lang=None;self.direction=None;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang');self.direction=a.get('dir')
  if tag=='option' and a.get('data-code'):self.options.append(a['data-code'])
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
class FifteenArticles(unittest.TestCase):
 def test_reading_pages_have_complete_same_article_language_navigation(self):
  catalog=json.loads((ROOT/'content/site-languages.json').read_text())['languages']
  for relative in ['about.html','briefing.html','day-20261017.html','update-20261028-1318.html','privacypolicy/index.html']:
   for row in catalog:
    p=ROOT/'site'/relative
    if row['code']!='ja':p=p.with_name(p.stem+'.'+row['code']+'.html')
    self.assertTrue(p.is_file(),str(p))
    page=Page(p.read_text());self.assertEqual(page.lang,row['html'])
    self.assertEqual(page.options,[r['code'] for r in catalog],str(p))
    if row['code']=='ar':self.assertEqual(page.direction,'rtl')
    self.assertEqual(len(page.canonical),1,str(p))
 def test_motion_never_offers_an_english_fallback_as_a_complete_locale(self):
  import subprocess
  script='const a=require("./tools/check-motion-locales.cjs").audit(process.cwd());console.log(JSON.stringify(a));'
  status=json.loads(subprocess.check_output(['node','-e',script],cwd=ROOT,text=True))
  self.assertEqual([k for k,v in status.items() if not v['ready']],[])
 def test_accessible_attributes_are_translated_without_changing_source_urls(self):
  import sys
  sys.path.insert(0,str(ROOT/'tools'));import article_languages as a
  raw='<html lang="ja"><meta name="description" content="影響は16件"><a href="https://example.org/日本語" aria-label="一次資料">一次資料</a></html>'
  values={a.key('影響は16件'):'16 affected',a.key('一次資料'):'Primary source'}
  rendered=a.render(raw,values)
  self.assertIn('content="16 affected"',rendered)
  self.assertIn('aria-label="Primary source"',rendered)
  self.assertIn('href="https://example.org/日本語"',rendered)
if __name__=='__main__':unittest.main()
