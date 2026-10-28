"""Publication invariants: actual harm, unknown values and accessible navigation."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class ImpactPublication(unittest.TestCase):
    def test_sourced_impact_not_a_victim_counter(self):
        latest = json.loads((ROOT/'data/latest.json').read_text())
        impact = json.loads((ROOT/'site/data/impact.json').read_text())
        self.assertEqual(impact['cutoff'], latest['cutoff'])
        self.assertGreaterEqual(len(impact['records']), 8)
        ids = set()
        for row in impact['records']:
            self.assertNotIn(row['id'], ids)
            ids.add(row['id'])
            for key in ('confirmed', 'unknown', 'response', 'sources'):
                self.assertTrue(row[key], (row['id'], key))
            self.assertIn(row['status'], ('confirmed-impact', 'exploitation-confirmed', 'potential'))
            for source in row['sources']:
                self.assertTrue(source['url'].startswith('https://'))
            self.assertIsNone(row.get('total_loss_jpy'), 'Unknown loss must not become zero or an inferred total')

    def test_nojs_tabs_and_full_content(self):
        impact = (ROOT/'site/impact.html').read_text()
        database = (ROOT/'site/database.html').read_text()
        self.assertIn('href="/impact" aria-current="page"', impact)
        self.assertIn('href="/database" aria-current="page"', database)
        self.assertIn('href="/impact"', database)
        self.assertIn('href="/data/impact.json"', impact)
        self.assertIn('確認できた影響', impact)
        self.assertIn('分かっていないこと', impact)
        self.assertIn('infoq', impact)
        self.assertIn('href="/impact"', (ROOT/'site/index.html').read_text())
        self.assertIn('https://www.infosec-briefing.net/impact', (ROOT/'site/sitemap.xml').read_text())

if __name__ == '__main__':
    unittest.main()
