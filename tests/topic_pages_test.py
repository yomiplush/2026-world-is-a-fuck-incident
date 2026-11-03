import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class TopicPages(unittest.TestCase):
    def test_new_topics_have_bilingual_source_linked_pages(self):
        config = json.loads((ROOT / 'content/topic-pages.json').read_text())
        for topic in config['ids']:
            for suffix in ('', '.en'):
                page = ROOT / 'site/topics' / (topic + suffix + '.html')
                self.assertTrue(page.exists(), str(page))
                text = page.read_text()
                self.assertIn('https://github.com/advisories/GHSA-', text)
                self.assertIn('2026-11-03', text)
                self.assertIn('/update-20261103-1620' + suffix, text)
                self.assertIn('first', text.lower()) if suffix else self.assertIn('修正版', text)
                report = (ROOT / 'site' / ('update-20261103-1620' + suffix + '.html')).read_text()
                self.assertIn('href="/topics/' + topic + suffix + '"', report)

if __name__ == '__main__':
    unittest.main()
