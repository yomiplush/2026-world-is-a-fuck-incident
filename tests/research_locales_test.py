import json,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,raw):super().__init__();self.options=[];self.lang=None;self.direction=None;self.feed(raw)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang');self.direction=a.get('dir')
  if tag=='option':self.options.append(a)
class ResearchLocales(unittest.TestCase):
 def test_both_views_offer_the_same_two_supported_languages(self):
  catalog=json.loads((ROOT/'content/site-languages.json').read_text())['languages'];latest=json.loads((ROOT/'data/latest.json').read_text())
  for row in catalog:
   code=row['code'];suffix='' if code=='ja' else '.'+code
   for view in ('impact','database'):
    path=ROOT/'site'/(view+suffix+'.html');self.assertTrue(path.exists(),str(path))
    page=Page(path.read_text());self.assertEqual(page.lang,row['html'])
    actual=[o.get('data-code') for o in page.options if 'disabled' not in o]
    self.assertEqual(actual,[r['code'] for r in catalog],(view,code,actual))
    if code=='ar':self.assertEqual(page.direction,'rtl')
   package=json.loads((ROOT/'site/data/translations'/Path(latest['incident_register']).parent/(code+'.json')).read_text())
   self.assertEqual(package['database']['cutoff'],latest['cutoff'])
   self.assertEqual(len(package['database']['records']),116)
 def test_english_articles_keep_impact_language(self):
  import re
  text=(ROOT/'site/about.en.html').read_text()
  nav=re.search(r'<nav class="global">(.*?)</nav>',text,re.S)[1]
  self.assertIn('href="/impact.en"',nav)
  self.assertNotIn('href="/impact"',nav)
if __name__=='__main__':unittest.main()
