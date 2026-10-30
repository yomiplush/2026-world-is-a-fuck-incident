"""The recollection command must not overwrite saved research evidence."""
import hashlib
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]

class CollectionCommand(unittest.TestCase):
    def test_existing_snapshot_is_rejected_without_modifying_evidence(self):
        folder = ROOT / 'data/2026-10-30-1031'
        manifest = folder / 'collection-summary.json'
        before = hashlib.sha256(manifest.read_bytes()).hexdigest()
        result = subprocess.run([sys.executable, str(ROOT / 'tools/intel/snapshot-20261030.py'),
                                 '--output-dir', str(folder)], capture_output=True, text=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('already exists', result.stderr)
        self.assertEqual(hashlib.sha256(manifest.read_bytes()).hexdigest(), before)

if __name__ == '__main__':
    unittest.main()
