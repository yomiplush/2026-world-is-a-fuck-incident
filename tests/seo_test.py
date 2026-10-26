"""Publication checks independent of client-side rendering and network."""
import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
BASE = 'https://www.infosec-briefing.net/'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonical=[]; self.meta={}; self.schema=[]; self.alternates={}; self.title=''; self.in_title=False; self.in_json=False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
        if tag=='link' and a.get('hreflang'):self.alternates[a['hreflang']]=a['href']
        if tag=='meta':self.meta[a.get('name',a.get('property'))]=a.get('content')
        if tag=='title':self.in_title=True
        if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
        if tag=='script':self.in_json=False
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.in_json:self.schema.append(json.loads(data))

class Publication(unittest.TestCase):
    def test_all_indexable_pages_have_canonical_identity_and_schema(self):
        titles=set()
        for file in SITE.rglob('*.html'):
            if file.name=='404.html':continue
            with self.subTest(file=file.name):
                p=Page(file.read_text())
                self.assertEqual(len(p.canonical),1)
                self.assertTrue(p.canonical[0].startswith(BASE),p.canonical)
                self.assertFalse(urlsplit(p.canonical[0]).path.endswith('.html'))
                self.assertEqual(p.meta['og:url'],p.canonical[0])
                self.assertTrue(p.meta['description'])
                self.assertTrue(p.meta['og:image'].startswith(BASE))
                self.assertTrue(p.schema)
                self.assertNotIn(p.title,titles);titles.add(p.title)
    def test_public_contact_does_not_require_cdn_decoding(self):
        for filename in ['about.html','privacypolicy/index.html']:
            text=(SITE/filename).read_text()
            self.assertIn('<!--email_off--><a href="mailto:contact@yomiplush.dev">',text)

    def test_non_http_links_are_preserved(self):
        import importlib.util
        spec=importlib.util.spec_from_file_location('publisher',ROOT/'tools/publish-site.py')
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        for url in ['mailto:contact@yomiplush.dev','tel:+81300000000','data:image/svg+xml,%3Csvg%3E','#actions']:
            self.assertEqual(module.clean_url(url),url)

    def test_sitemap_only_final_canonical_pages(self):
        ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        tree=ET.parse(SITE/'sitemap.xml');urls=[n.text for n in tree.findall('s:url/s:loc',ns)]
        expected={Page(p.read_text()).canonical[0] for p in SITE.rglob('*.html') if p.name!='404.html'}
        self.assertEqual(len(urls),len(set(urls)))
        self.assertEqual(set(urls),expected)
        for u in urls:self.assertTrue(u.startswith(BASE));self.assertNotIn('.html',urlsplit(u).path)
    def test_robot_feed_and_real_404(self):
        self.assertIn('Sitemap: '+BASE+'sitemap.xml',(SITE/'robots.txt').read_text())
        self.assertTrue((SITE/'404.html').exists())
        self.assertIn('noindex',Page((SITE/'404.html').read_text()).meta['robots'])
        ET.parse(SITE/'feed.xml')
    def test_latest_feed_and_public_data_match_register(self):
        latest=json.loads((ROOT/'data/latest.json').read_text())
        feed=ET.parse(SITE/'feed.xml')
        self.assertEqual(feed.findtext('channel/item/link'),latest['site_report'])
        public=json.loads((SITE/'data/latest.json').read_text())
        original=json.loads((ROOT/'data'/latest['incident_register']).read_text())
        self.assertEqual(public['records'],original['records'])
        self.assertEqual(public['counts'],original['counts'])

    def test_static_reading_entry_and_editorial_transparency(self):
        text=(SITE/'index.html').read_text()
        self.assertIn('id="entry-reading"',text)
        self.assertIn('一次情報',text)
        self.assertTrue((SITE/'about.html').exists());self.assertTrue((SITE/'database.html').exists())
        # Runtime-only query languages must not masquerade as static translations.
        self.assertEqual(Page(text).alternates,{})
    def test_translated_hreflang_is_reciprocal(self):
        pages=[Page(p.read_text()) for p in SITE.glob('tailworm*.html')]
        self.assertEqual(len(pages),12)
        for p in pages:
            self.assertEqual(len(p.alternates),13)
            self.assertEqual(p.alternates,pages[0].alternates)
            self.assertIn(p.canonical[0],p.alternates.values())

if __name__=='__main__':unittest.main()
