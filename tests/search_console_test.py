"""Search Console sitemap groups cover the published language sets exactly."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'site'
BASE='https://www.infosec-briefing.net/'
NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
spec=importlib.util.spec_from_file_location('search_console_publisher',ROOT/'tools/publish-site.py')
publisher=importlib.util.module_from_spec(spec);spec.loader.exec_module(publisher)

def locations(path):
    return [node.text for node in ET.parse(path).findall('s:url/s:loc',NS)]

class SearchConsoleSitemaps(unittest.TestCase):
    def test_language_groups_partition_the_existing_canonical_sitemap(self):
        for name in ['sitemap-en.xml','sitemap-ja.xml','sitemap-index.xml']:
            self.assertTrue((SITE/name).is_file(),name+' must be published')
        english=locations(SITE/'sitemap-en.xml');japanese=locations(SITE/'sitemap-ja.xml')
        self.assertIn(BASE+'en/',english)
        self.assertIn(BASE+'privacypolicy/index.en',english)
        self.assertEqual(len(english),len(set(english)))
        self.assertEqual(len(japanese),len(set(japanese)))
        self.assertFalse(set(english)&set(japanese))
        self.assertEqual(set(english)|set(japanese),set(locations(SITE/'sitemap.xml')))
        index=ET.parse(SITE/'sitemap-index.xml')
        self.assertEqual([n.text for n in index.findall('s:sitemap/s:loc',NS)],
                         [BASE+'sitemap-en.xml',BASE+'sitemap-ja.xml'])
        self.assertIn('Sitemap: '+BASE+'sitemap-index.xml',(SITE/'robots.txt').read_text())

    def test_grouping_uses_page_language_and_excludes_noindex(self):
        with tempfile.TemporaryDirectory() as directory:
            site=Path(directory)
            fixtures={
                'translated.html':'<html lang="en"><head><title>English</title></head></html>',
                'index.html':'<html lang="ja"><head><title>日本語</title></head></html>',
                'draft.en.html':'<html lang="en"><head><meta name="robots" content="noindex,follow"></head></html>',
                'blocked.html':'<html lang="ja"><head><meta name="googlebot" content="none"></head></html>',
                '404.en.html':'<html lang="en"><head><title>Not found</title></head></html>',
            }
            for name,text in fixtures.items():(site/name).write_text(text)
            with patch.object(publisher,'SITE',site):
                for file in site.glob('*.html'):
                    file.write_text(publisher.metadata(file,file.read_text()))
                publisher.discovery(sorted(site.glob('*.html')))
            self.assertTrue((site/'sitemap-en.xml').is_file(),'Generator must publish language groups')
            self.assertEqual(locations(site/'sitemap-en.xml'),[BASE+'translated'])
            self.assertEqual(locations(site/'sitemap-ja.xml'),[BASE])
            self.assertEqual(set(locations(site/'sitemap.xml')),{BASE,BASE+'translated'})

if __name__=='__main__':unittest.main()
