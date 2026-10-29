"""Publication controller tests use real temporary Git repositories."""
import importlib.machinery
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'tools/update-infosec'


class ControllerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        loader = importlib.machinery.SourceFileLoader('update_infosec', str(SCRIPT))
        spec = importlib.util.spec_from_loader(loader.name, loader)
        cls.app = importlib.util.module_from_spec(spec)
        loader.exec_module(cls.app)

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)

    def git(self, *args):
        return subprocess.check_output(['git', '-C', str(self.root), *args], text=True).strip()

    def repo(self):
        self.git('init', '-q', '-b', 'main')
        self.git('config', 'user.name', 'Test')
        self.git('config', 'user.email', 'test@example.invalid')
        (self.root / 'original').write_text('original')
        self.git('add', '.')
        self.git('commit', '-qm', 'initial')
        return self.git('rev-parse', 'HEAD')

    def fixture(self):
        run_id = '20261029T030000Z-test'
        snapshot = self.root / 'data' / run_id
        snapshot.mkdir(parents=True)
        (self.root/'site').mkdir()
        raw = snapshot/'vendor.txt'
        raw.write_text('Official advisory')
        source = {'url': 'https://vendor.example/advisory', 'path': f'data/{run_id}/vendor.txt',
                  'sha256': self.app.sha256(raw), 'fetched_at': '2026-10-29T00:01:00Z', 'status': 200}
        (snapshot/'update-infosec-evidence.json').write_text(json.dumps({'sources': [source], 'failures': []}))
        record = {'id': 'advisory', 'title': 'Advisory', 'body': 'Known facts', 'action': 'Patch',
                  'sources': [{'name': 'vendor', 'url': source['url']}]}
        register = snapshot/'incident-register.json'
        register.write_text(json.dumps({'cutoff': '2026-10-29T00:00:00Z', 'records': [record]}))
        latest = {'cutoff': '2026-10-29T00:00:00Z', 'incident_register': f'{run_id}/incident-register.json',
                  'site_report': 'https://www.infosec-briefing.net/update-test'}
        (self.root/'data/latest.json').write_text(json.dumps(latest))
        (self.root/'site/data').mkdir()
        (self.root/'site/data/impact.json').write_text(json.dumps({'cutoff': latest['cutoff'], 'records': [
            {'id': 'impact', 'confirmed': 'Known', 'unknown': 'Unknown', 'response': 'Check', 'sources': record['sources']}]}))
        (self.root/'site/update-test.html').write_text('<h1>Report</h1>')
        result = {'status': 'ready', 'snapshot_dir': f'data/{run_id}', 'report_path': 'site/update-test.html',
                  'motion': 'existing scenes sufficient', 'summary': 'Updated', 'limitations': []}
        return run_id, result, source

    def test_help_does_not_require_configuration(self):
        proc = subprocess.run([str(SCRIPT), '--help'], capture_output=True, text=True)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertIn('--retry-deploy', proc.stdout)

    def test_agent_uses_reviewed_approvals_without_conflicting_sandbox_flag(self):
        command = self.app.agent_command({'codex': '/bin/codex'}, self.root, self.root)
        self.assertIn('--approve-for-me', command)
        self.assertNotIn('--sandbox', command)
        self.assertNotIn('--dangerously-bypass-approvals-and-sandbox', command)

    def test_second_run_cannot_take_same_lock(self):
        with self.app.lock(self.root):
            with self.assertRaisesRegex(self.app.UpdateError, '実行中'):
                with self.app.lock(self.root):
                    self.fail('second lock acquired')

    def test_safe_path_rejects_escape_and_symlink(self):
        with self.assertRaises(self.app.UpdateError):
            self.app.safe_path(self.root, '../outside')
        (self.root/'link').symlink_to('/tmp')
        with self.assertRaises(self.app.UpdateError):
            self.app.safe_path(self.root, 'link/anything')

    def test_requires_fresh_snapshot_and_complete_evidence(self):
        run_id, result, _ = self.fixture()
        self.app.validate_research(self.root, run_id, result, '2026-10-28T00:00:00Z')
        with self.assertRaisesRegex(self.app.UpdateError, '基準時刻'):
            self.app.validate_research(self.root, run_id, result, '2026-10-30T00:00:00Z')
        (self.root/result['snapshot_dir']/'vendor.txt').write_text('tampered')
        with self.assertRaisesRegex(self.app.UpdateError, 'SHA-256'):
            self.app.validate_research(self.root, run_id, result, '2026-10-28T00:00:00Z')

    def test_unknown_or_unsaved_sources_stop_publication(self):
        run_id, result, source = self.fixture()
        file = self.root/result['snapshot_dir']/'incident-register.json'
        register = json.loads(file.read_text())
        register['records'][0]['sources'][0]['url'] = 'https://unsaved.example/'
        file.write_text(json.dumps(register))
        with self.assertRaisesRegex(self.app.UpdateError, '未保存'):
            self.app.validate_research(self.root, run_id, result, '2026-10-28T00:00:00Z')

    def test_agent_must_not_change_history_or_controller(self):
        base = self.repo()
        (self.root/'tools').mkdir()
        (self.root/'tools/update-infosec').write_text('changed')
        with self.assertRaisesRegex(self.app.UpdateError, '更新対象外'):
            self.app.check_changes(self.root, base)
        (self.root/'tools/update-infosec').unlink()
        (self.root/'original').write_text('changed')
        self.git('add', '.')
        self.git('commit', '-qm', 'agent commit')
        with self.assertRaisesRegex(self.app.UpdateError, 'Git履歴'):
            self.app.check_changes(self.root, base)

    def test_failed_check_prevents_later_stages(self):
        marker = self.root/'published'
        with self.assertRaises(self.app.UpdateError):
            self.app.run(['python3', '-c', 'raise SystemExit(7)'], cwd=self.root)
            marker.touch()
        self.assertFalse(marker.exists())

    def test_live_files_must_match_verified_commit(self):
        base = self.repo()
        files = self.app.release_hashes(self.root, ['original'])
        self.app.verify_release(self.root, base, files)
        (self.root/'original').write_text('modified after verification')
        with self.assertRaises(self.app.UpdateError):
            self.app.verify_release(self.root, base, files)

    def test_dry_run_and_retry_are_mutually_exclusive(self):
        proc = subprocess.run([str(SCRIPT), '--dry-run', '--retry-deploy', 'test'], capture_output=True)
        self.assertNotEqual(proc.returncode, 0)

    def test_ignored_extra_file_cannot_enter_deployment(self):
        self.repo()
        (self.root/'site').mkdir()
        (self.root/'site/index.html').write_text('verified page')
        (self.root/'.gitignore').write_text('*.private\n')
        self.git('add', '.')
        self.git('commit', '-qm', 'site')
        commit = self.git('rev-parse', 'HEAD')
        hashes = self.app.release_hashes(self.root, ['site/index.html'])
        (self.root/'site/extra.private').write_text('must not upload')
        self.assertEqual(self.git('status', '--porcelain'), '')
        with self.assertRaises(self.app.UpdateError):
            self.app.verify_release(self.root, commit, hashes)

    def test_committed_retry_reconciles_remote_push_result(self):
        self.repo()
        commit = self.git('rev-parse', 'HEAD')
        remote = self.root/'remote.git'
        subprocess.run(['git', 'init', '--bare', '-q', str(remote)], check=True)
        self.git('push', str(remote), 'HEAD:main')
        record = {'stage': 'committed', 'commit': commit, 'hashes': self.app.release_hashes(self.root, ['original'])}
        self.app.check_retry(self.root, record, str(remote))
        record['commit'] = '0'*40
        with self.assertRaises(self.app.UpdateError):
            self.app.check_retry(self.root, record, str(remote))

    def test_timeout_stops_descendant_process(self):
        marker = self.root/'orphan'
        child = f'import time; from pathlib import Path; time.sleep(0.5); Path({str(marker)!r}).touch()'
        parent = f'import subprocess,time; subprocess.Popen(["python3","-c",{child!r}]); time.sleep(10)'
        with self.assertRaises(self.app.UpdateError):
            self.app.run(['python3', '-c', parent], timeout=0.15, capture=True)
        time.sleep(0.65)
        self.assertFalse(marker.exists(), 'timed-out descendant kept running')

    def test_interrupt_stops_descendant_process(self):
        marker = self.root/'orphan'
        started = self.root/'started'
        child = f'import time; from pathlib import Path; Path({str(started)!r}).touch(); time.sleep(0.7); Path({str(marker)!r}).touch()'
        parent = f'import subprocess,time; subprocess.Popen(["python3","-c",{child!r}]); time.sleep(10)'
        runner = ('import importlib.machinery,importlib.util; '
                  f'l=importlib.machinery.SourceFileLoader("app",{str(SCRIPT)!r}); '
                  's=importlib.util.spec_from_loader(l.name,l); m=importlib.util.module_from_spec(s); l.exec_module(m); '
                  f'm.run(["python3","-c",{parent!r}],capture=True)')
        proc = subprocess.Popen(['python3', '-c', runner], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            for _ in range(100):
                if started.exists():
                    break
                time.sleep(0.02)
            self.assertTrue(started.exists())
            os.kill(proc.pid, signal.SIGINT)
            proc.communicate(timeout=5)
            time.sleep(0.8)
            self.assertFalse(marker.exists(), 'interrupted descendant kept running')
        finally:
            if proc.poll() is None:
                proc.kill()
                proc.communicate()


if __name__ == '__main__':
    unittest.main()
