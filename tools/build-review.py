#!/usr/bin/env python3
"""Render a dated attributed review. No network or packages.
Usage: python3 tools/build-review.py data/2026-10-26-1456/incident-register.json
"""
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('daily', ROOT / 'tools/build-daily.py')
daily = importlib.util.module_from_spec(spec)
spec.loader.exec_module(daily)
esc, anchor, REPO = daily.esc, daily.anchor, daily.REPO


def article(row):
    labels = {'confirmed-publication': '公表・更新を確認', 'CNA-unreviewed': 'CNA記録・成立条件に留保',
              'prior-scope': '既存の問題・対応範囲の補完', 'timestamp-unconfirmed': '基準時刻以前の公開は未確定'}
    sources = ' / '.join(anchor(s['url'], s['name']) for s in row['sources'])
    return f'''<article id="{esc(row['id'])}"><p class="event-type">{esc(row['time'])} · {esc(labels[row['certainty']])}</p>
<h3>{esc(row['title'])}</h3><p>{esc(row['body'])}</p><p class="action"><strong>確認すること</strong>{esc(row['action'])}</p><p class="sources">{sources}</p></article>'''


def main(path):
    record = json.loads(path.read_text())
    report, counts = record['report'], record['counts']
    stamp = path.parent.name
    research_doc = 'docs/research-' + stamp + '.md'
    motion_path = report.get('motion_path', './?lang=ja#54')
    motion_label = report.get('motion_label', '追加2画面のモーション →')
    groups = {kind: [r for r in record['records'] if r['kind'] == kind]
              for kind in ('delta', 'scope-complement', 'reference-only')}
    quick = ''.join(f'<article><h3>{esc(r["title"])}</h3><p>{esc(r["text"])}</p>{anchor(r["href"],r["label"]+" →")}</article>' for r in report['quick'])
    content = f'''<header><p class="kicker">SECURITY REVIEW · {esc(report['cutoff_jst_label'])}</p><h1>{esc(report['headline'])}</h1>
<p class="intro">{esc(report['intro'])}</p><p class="date">対象：{esc(report['cutoff_jst_label'])}。差分窓：{esc(report['window_jst'])}。<br>実取得は{esc(report['retrieved_jst'])}。日付のみの同日続報は参考枠です。</p>
<div class="report-links">{anchor('#quick','忙しい人向け →')}{anchor('#delta','登録・勧告更新 →')}{anchor('#continuity','既存事件の対応補完 →')}{anchor(motion_path,motion_label)}{anchor('./timeline.html','日付順の記録 →')}</div></header>
<section id="quick"><h2>忙しい人向け：使っているものだけ。</h2><div class="priority-grid">{quick}</div></section>
<aside><strong>修正の提供と、展開・復旧を分けます。</strong><p>公開サービスの更新・侵害調査と、漏れた鍵や権限の失効は継続。配布済みのパッチ、段階配信、復旧目標を同じ状態にしません。Tailwormの最低修正版は今回も未確定。ConnectWiseの個別案内前に接続を再許可しないでください。</p>{anchor('./update-20261026.html','朝の21群・条件別の継続対応表 →')}</aside>'''
    descriptions = {
        'delta': ('delta', '差分窓の登録・勧告更新', 'DB収録・改訂や勧告の更新時刻で整理しています。攻撃の開始時刻や、新たに発生した被害件数ではありません。'),
        'scope-complement': ('continuity', '既存事案の対策と条件の補足', '既公表資料の条件、修正・配置方法、業務影響を補完。今回の時間帯に起きた新しい侵害として数え直していません。'),
        'reference-only': ('reference', '参考：同日でも公開時刻は未確定', '対象時刻後に取得した現行本文です。次の情報を基準時刻以前の確定した差分には含めません。')}
    for kind, (section_id, title, description) in descriptions.items():
        rows = groups[kind]
        if kind == 'delta':
            rows = sorted(rows, key=lambda r: (re.search(r'\d{2}:\d{2}', r['time']) or ['99:99'])[0])
        content += f'<section id="{section_id}"><h2>{esc(title)} · {len(rows)}群</h2><p>{esc(description)}</p>' + ''.join(article(r) for r in rows) + '</section>'
    stats = [('NVD新規', counts['nvd_published']), ('NVD改訂', counts['nvd_modified']),
             ('GHSA公開窓', counts['ghsa']), ('検証した保存・参照応答', counts['verified_response_records'])]
    content += '<section id="evidence"><h2>収集範囲・重複・限界</h2><div class="evidence-counts">' + ''.join(
        f'<div><strong>{value:,}</strong><span>{esc(label)}</span></div>' for label, value in stats) + '</div>'
    ghsa_note = (f'GHSA新規公開{counts["ghsa"]}件（unreviewed{counts.get("ghsa_unreviewed",0)}、malware{counts.get("ghsa_malware",0)}）、改訂{counts.get("ghsa_modified",0)}件。今回からmalwareも明示的に取得し、前回の検索範囲との差を留保します。' if 'ghsa_modified' in counts else 'GHSAは新規公開窓のみで、既存情報の改訂を含む全変化が0という意味ではありません。')
    content += f'<p>NVD新規{counts["nvd_published"]}件は改訂{counts["nvd_modified"]}件に全件重複。{esc(ghsa_note)}KEVは{record["kev"]["catalog_version"]}版・{record["kev"]["count"]:,}件で、前回原本と同一。非掲載を悪用不存在の証明にはしません。{counts["verified_response_records"]}応答のうち{counts["deduplicated_previous_references"]}件は過去原本への参照で重複保存を避けています。</p>'
    content += '<ul>' + ''.join(f'<li>{esc(c)}</li>' for c in record['caveats']) + '</ul>'
    links = [path.relative_to(ROOT).as_posix(), f'data/{stamp}/collection-summary.json',
             f'data/{stamp}-vendors/collection-summary.json', f'docs/research-collection-{stamp}.md',
             research_doc, 'data/latest.json']
    content += '<p>' + ' / '.join(anchor(REPO+p, p) for p in links) + '</p></section>'
    content += '<section><h2>前回の記録へ</h2>' + anchor('./'+report['previous'], report['previous_label']) + '</section>'
    result = daily.shell(report['path'], report['title'], report['intro'], content)
    result = result.replace('基準 2026-10-26 10:27 JST / 01:27 UTC。', '基準 '+report['cutoff_jst_label']+'。')
    result = result.replace('docs/29-snapshot-20261026-1027.ja.md', research_doc)
    (ROOT / 'site' / report['path']).write_text(result)
    print(f'Built {report["path"]}: {len(record["records"])} editorial topic groups')


if __name__ == '__main__':
    main((ROOT / sys.argv[1]).resolve())
