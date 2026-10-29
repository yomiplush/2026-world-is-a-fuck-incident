"""Verify saved research evidence, API completeness and cross-view publication state."""
import gzip
import hashlib
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return json.loads(path.read_text())


def raw(path):
    data = path.read_bytes()
    return gzip.decompress(data) if path.suffix == '.gz' else data


class ResearchEvidence(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.latest = read(ROOT / 'data/latest.json')
        cls.folder = (ROOT / 'data' / cls.latest['incident_register']).parent
        cls.register = read(cls.folder / 'incident-register.json')
        cls.summary = read(cls.folder / 'collection-summary.json')
        cls.evidence = read(cls.folder / 'update-infosec-evidence.json')
        cls.impact = read(ROOT / 'data' / cls.latest['impact_register'])

    def test_all_source_urls_have_immutable_successful_evidence(self):
        by_url = {}
        for source in self.evidence['sources']:
            path = (ROOT / source['path']).resolve()
            self.assertTrue(path.is_relative_to(ROOT / 'data'))
            self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), source['sha256'])
            self.assertEqual(source['status'], 200)
            self.assertTrue(source['fetched_at'])
            by_url.setdefault(source['url'], []).append(raw(path))
        for document in (self.register, self.impact):
            for record in document['records']:
                for source in record['sources']:
                    self.assertIn(source['url'], by_url, record['id'])
        for record in self.register['records']:
            if record.get('monitoring_status') in ('newly-covered', 'updated'):
                body = b'\n'.join(part for s in record['sources'] for part in by_url[s['url']])
                for cve in record.get('cve_ids', []):
                    self.assertIn(cve.encode(), body, record['id'])

    def test_full_nvd_and_ghsa_windows_and_deduplicated_counts(self):
        self.assertEqual(self.summary['delta_start'], self.register['delta_start'])
        for key in ('nvd-published', 'nvd-modified'):
            result = self.summary[key]
            self.assertTrue(result['complete'], key)
            ids = set()
            returned = 0
            for page in result['pages']:
                document = json.loads(raw(self.folder / page['file']))
                batch = document['vulnerabilities']
                self.assertEqual(len(batch), page['returned'])
                self.assertIn(self.register['delta_start'][:10], page['url'])
                self.assertIn(self.register['cutoff'][:10], page['url'])
                ids.update(row['cve']['id'] for row in batch)
                returned += len(batch)
            self.assertEqual(returned, result['totalResults'])
            self.assertEqual(len(ids), result['returned'])
        for key in ('ghsa', 'ghsa-modified'):
            result = self.summary[key]
            self.assertTrue(result['complete'], key)
            self.assertEqual({p['type'] for p in result['pages']}, {'reviewed', 'unreviewed', 'malware'})
            ids = {a['ghsa_id'] for p in result['pages'] for a in read(self.folder / p['file'])}
            self.assertEqual(len(ids), result['returned'])

    def test_new_advisory_conditions_are_preserved_from_raw_api(self):
        originals = {}
        for page in self.summary['ghsa']['pages']:
            if page['type'] in ('reviewed', 'malware'):
                originals.update({a['ghsa_id']: a for a in read(self.folder / page['file'])})
        saved = {}
        for row in self.register['records']:
            if row.get('monitoring_status') == 'newly-covered':
                for advisory in row.get('advisories', []):
                    self.assertNotIn(advisory['id'], saved)
                    saved[advisory['id']] = advisory
        self.assertEqual(set(originals), set(saved))
        for key, advisory in saved.items():
            self.assertEqual(advisory['packages'], originals[key]['vulnerabilities'])
            self.assertEqual(advisory['updated_at'], originals[key]['updated_at'])

    def test_historical_ids_and_unknown_losses_survive(self):
        previous = read(ROOT / 'data' / self.latest['previous_register'])
        self.assertTrue({r['id'] for r in previous['records']} <= {r['id'] for r in self.register['records']})
        self.assertEqual(self.latest['cutoff'], self.impact['cutoff'])
        for row in self.impact['records']:
            self.assertIsNone(row['total_loss_jpy'])
        recovered = next(r for r in self.impact['records'] if r['id'] == 'unm-recovered-impact')
        self.assertEqual(recovered['recovery_state'], 'restored-per-organization')

    def test_current_english_packages_match_current_sources(self):
        for store in ('translations', 'impact-translations'):
            folder = ROOT / 'data' / store / self.folder.name
            source, english = read(folder / 'source.json'), read(folder / 'en.json')
            self.assertEqual(source['source_hash'], english['source_hash'])
            self.assertEqual(source['register_hash'], english['register_hash'])
            self.assertEqual(source['cutoff'], self.latest['cutoff'])
            self.assertEqual(set(source['strings']), set(english['strings']))


if __name__ == '__main__':
    unittest.main()
