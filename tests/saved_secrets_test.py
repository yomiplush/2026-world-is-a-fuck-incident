import gzip
import importlib.util
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('saved_secrets',Path(__file__).resolve().parents[1]/'tools/intel/check-saved-secrets.py')
scanner=importlib.util.module_from_spec(spec);spec.loader.exec_module(scanner)
class SavedSecrets(unittest.TestCase):
 def test_embedded_key_in_plain_and_compressed_capture(self):
  fake=b'AI'+b'za'+b'A'*35
  self.assertTrue(scanner.contains_key(b'config="'+fake+b'"'))
  self.assertTrue(scanner.contains_key(gzip.compress(fake),True))
 def test_redacted_capture_is_safe(self):
  self.assertFalse(scanner.contains_key(b'config="[REDACTED_GOOGLE_API_KEY]"'))
 def test_tracked_captures_contain_no_embedded_google_keys(self):
  import contextlib
  import io
  with contextlib.redirect_stdout(io.StringIO()) as output:
   result=scanner.main()
  self.assertEqual(result,0,output.getvalue())
