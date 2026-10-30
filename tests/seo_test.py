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
        super().__init__(); self.canonical=[]; self.meta={}; self.schema=[]; self.alternates={}; self.title=''; self.in_title=False; self.in_json=False; self.links=[]
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
        if tag=='link' and a.get('hreflang'):self.alternates[a['hreflang']]=a['href']
        if tag=='meta':self.meta[a.get('name',a.get('property'))]=a.get('content')
        if tag=='a':self.links.append(a.get('href'))
        if tag=='title':self.in_title=True
        if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
        if tag=='script':self.in_json=False
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.in_json:self.schema.append(json.loads(data))

class Publication(unittest.TestCase):
    def test_english_hub_has_static_routes_to_available_english_research(self):
        path=SITE/'en/index.html'
        self.assertTrue(path.is_file(), 'English search entry must be published')
        text=path.read_text();page=Page(text)
        self.assertEqual(page.canonical,[BASE+'en/'])
        self.assertIn('"inLanguage":"en"',text)
        class Links(HTMLParser):
            def __init__(self):super().__init__();self.hrefs=[]
            def handle_starttag(self,tag,attrs):
                if tag=='a':self.hrefs.append(dict(attrs).get('href'))
        links=Links();links.feed(text)
        latest=json.loads((ROOT/'data/latest.json').read_text())['site_report']
        latest_path=urlsplit(latest).path.removesuffix('.html')+'.en'
        for href in [latest_path,'/database.en','/impact.en','/timeline.en','/about.en','/feed.en.xml']:
            self.assertIn(href,links.hrefs)
        self.assertNotIn('hreflang="ja"',text,'A distinct research hub is not a translation of the motion entrance')

    def test_motion_entrance_exposes_english_links_without_javascript(self):
        text=(SITE/'index.html').read_text()
        self.assertIn('href="/en/"',text)
        latest=json.loads((ROOT/'data/latest.json').read_text())['site_report']
        path=urlsplit(latest).path.removesuffix('.html')+'.en'
        self.assertIn('href="'+path+'"',text)

    def test_english_rss_only_lists_complete_english_articles(self):
        path=SITE/'feed.en.xml'
        self.assertTrue(path.is_file(), 'English readers need an English feed')
        rss=ET.parse(path)
        self.assertEqual(rss.findtext('channel/language'),'en')
        latest=json.loads((ROOT/'data/latest.json').read_text())['site_report']+'.en'
        self.assertEqual(rss.findtext('channel/item/link'),latest)
        for item in rss.findall('channel/item'):
            route=urlsplit(item.findtext('link')).path
            self.assertTrue(route.endswith('.en'))
            self.assertTrue((SITE/(route.lstrip('/')+'.html')).is_file())
        for file in SITE.rglob('*.html'):
            page=Page(file.read_text())
            if '"inLanguage":"en"' in file.read_text():
                self.assertIn('href="/feed.en.xml"',file.read_text(),str(file))
                self.assertNotIn('/feed.xml',page.links,str(file))

    def test_article_dates_use_verified_publication_records_not_research_cutoffs(self):
        import importlib.util
        from unittest.mock import patch
        spec=importlib.util.spec_from_file_location('publisher',ROOT/'tools/publish-site.py')
        publisher=importlib.util.module_from_spec(spec);spec.loader.exec_module(publisher)
        file=SITE/'update-fixture.en.html'
        html='<html lang="en"><head><title>Authentication review</title><meta name="description" content="Evidence review"></head><body><main></main></body></html>'
        dates={'/update-fixture.en':{'published':'2026-10-29T09:00:00+09:00','modified':'2026-10-30T10:00:00+09:00'}}
        with patch.object(publisher,'PUBLICATION_DATES',dates,create=True):
            text=publisher.metadata(file,html)
        article=next(n for n in Page(text).schema[0]['@graph'] if n['@type']=='Article')
        self.assertEqual(article.get('datePublished'),'2026-10-29T09:00:00+09:00')
        self.assertEqual(article.get('dateModified'),'2026-10-30T10:00:00+09:00')
        self.assertIn('datetime="2026-10-30T10:00:00+09:00"',text)
        with patch.object(publisher,'PUBLICATION_DATES',{},create=True):
            article=next(n for n in Page(publisher.metadata(file,html)).schema[0]['@graph'] if n['@type']=='Article')
        self.assertNotIn('datePublished',article)
        self.assertNotIn('dateModified',article)

    def test_publication_records_reject_ambiguous_or_reversed_dates(self):
        import importlib.util
        from unittest.mock import patch
        spec=importlib.util.spec_from_file_location('publisher',ROOT/'tools/publish-site.py')
        publisher=importlib.util.module_from_spec(spec);spec.loader.exec_module(publisher)
        for dates in [
            {'published':'2026-10-30T10:00:00'},
            {'modified':'2026-10-30T10:00:00+09:00'},
            {'published':'2026-10-30T10:00:00+09:00','modified':'2026-10-29T10:00:00+09:00'},
        ]:
            with self.subTest(dates=dates), patch.object(publisher,'PUBLICATION_DATES',{'/fixture':dates}):
                with self.assertRaises(ValueError):publisher.publication_dates(BASE+'fixture')

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

    def test_entrance_links_to_current_report_with_visible_date(self):
        import importlib.util
        from datetime import datetime
        spec=importlib.util.spec_from_file_location('publisher',ROOT/'tools/publish-site.py')
        publisher=importlib.util.module_from_spec(spec);spec.loader.exec_module(publisher)
        class Links(HTMLParser):
            def __init__(self,text):
                super().__init__();self.links=[];self.active=None;self.feed(text)
            def handle_starttag(self,tag,attrs):
                if tag=='a':self.active=[dict(attrs),'']
            def handle_data(self,text):
                if self.active:self.active[1]+=text
            def handle_endtag(self,tag):
                if tag=='a' and self.active:self.links.append(self.active);self.active=None
        for cutoff,report in [('2026-10-29T14:01:25+09:00','/update-20261029-1401'),('2026-10-30T09:00:00+09:00','/update-20261030-0900')]:
            publisher.LATEST=dict(publisher.LATEST,cutoff_jst=cutoff,site_report=BASE.rstrip('/')+report)
            text=publisher.root_reading((SITE/'index.html').read_text())
            current=[label for attrs,label in Links(text).links if attrs.get('href')==report]
            self.assertTrue(current,'entrance must expose the latest article')
            self.assertIn(datetime.fromisoformat(cutoff).strftime('%m/%d %H:%M'),current[0])
            self.assertEqual(publisher.root_reading(text),text,'rebuild must not duplicate links')

    def test_non_http_links_are_preserved(self):
        import importlib.util
        spec=importlib.util.spec_from_file_location('publisher',ROOT/'tools/publish-site.py')
        module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
        for url in ['mailto:contact@yomiplush.dev','tel:+81300000000','data:image/svg+xml,%3Csvg%3E','#actions']:
            self.assertEqual(module.clean_url(url),url)

    def test_sitemap_only_final_canonical_pages(self):
        ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        tree=ET.parse(SITE/'sitemap.xml');urls=[n.text for n in tree.findall('s:url/s:loc',ns)]
        expected={Page(p.read_text()).canonical[0] for p in SITE.rglob('*.html') if p.name not in ('404.html','404.en.html')}
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
        self.assertNotIn('id="entry-reading"',text)
        self.assertIn('class="entry-library"',text)
        self.assertIn('一次情報',text)
        self.assertTrue((SITE/'about.html').exists());self.assertTrue((SITE/'database.html').exists())
        # Runtime-only query languages must not masquerade as static translations.
        self.assertEqual(Page(text).alternates,{})
    def test_translated_hreflang_is_reciprocal(self):
        pages=[Page(p.read_text()) for p in SITE.glob('tailworm*.html')]
        self.assertEqual(len(pages),len(json.loads((ROOT/'content/site-languages.json').read_text())['languages']))
        for p in pages:
            self.assertEqual(len(p.alternates),len(json.loads((ROOT/'content/site-languages.json').read_text())['languages'])+1)
            self.assertEqual(p.alternates,pages[0].alternates)
            self.assertIn(p.canonical[0],p.alternates.values())

if __name__=='__main__':unittest.main()
