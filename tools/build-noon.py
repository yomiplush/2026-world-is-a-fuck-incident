#!/usr/bin/env python3
"""Render the 13:01 reading report from the attributed research register."""
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('daily', ROOT / 'tools/build-daily.py')
daily = importlib.util.module_from_spec(spec)
spec.loader.exec_module(daily)
esc, anchor = daily.esc, daily.anchor
REPO = daily.REPO
register = json.loads((ROOT / 'data/2026-10-26-1301/incident-register.json').read_text())


def article(row):
    labels = {'confirmed-publication': '公表・配信を確認', 'CNA-unreviewed': 'CNA記録・成立条件に留保',
              'prior-scope': '既存事件の補完', 'timestamp-unconfirmed': '13:01以前の公開は未確定'}
    sources = ' / '.join(anchor(s['url'], s['name']) for s in row['sources'])
    return f'''<article id="{esc(row['id'])}"><p class="event-type">{esc(row['time'])} · {esc(labels[row['certainty']])}</p>
<h3>{esc(row['title'])}</h3><p>{esc(row['body'])}</p><p class="action"><strong>確認すること</strong>{esc(row['action'])}</p><p class="sources">{sources}</p></article>'''


def time_key(row):
    match = re.search(r'(\d{2}):(\d{2})', row['time'])
    return match.group(0) if match else '99:99'


content = '''<header><p class="kicker">SECURITY REVIEW · 2026-10-26 13:01 JST</p>
<h1>広がる影響を、<br>自分の対応へ。</h1><p class="intro">国内の漏えいと業務障害、ソフトウェアの追加勧告、AI・MCPまで。新しく判明したことと、継続中の対応を一次資料から整理しました。</p>
<p class="date">対象：2026-10-26 13:01 JST / 04:01 UTC。差分窓：10:27〜13:01 JST。<br>実取得は13:04 JST以降。日付だけの同日続報は参考枠へ分けています。</p>
<div class="report-links"><a href="#quick">忙しい人向け・1分 →</a><a href="#delta">午前の差分を時刻順に →</a><a href="./timeline.html">10日分を古い日付から →</a><a href="./?lang=ja">53画面のブリーフィング →</a></div></header>
<section id="quick"><h2>忙しい人向け：自分に関係する行だけ。</h2>
<div class="priority-grid">
<article><span class="status confirmed">公開サーバー・機器</span><h3>更新と侵害調査を続ける。</h3><p>PHP・GitLab・PAN-OS・Arista・Nextcloud CODE・Plex等。対象構成と稼働版を確認し、パッチ適用に加えて既存の侵入も調査します。</p><a href="./update-20261026.html">朝の21群・条件別対応表 →</a></article>
<article><span class="status confirmed">鍵・クラウド・FX</span><h3>パスワード変更の、その先まで。</h3><p>LiteLLM・Railway・ConnectWise等では鍵の失効、追加権限とログを確認。GMOデスクトップクラウドのFX利用者は、別の安全な端末から変更し、残存する全セッションも切断します。</p><a href="#gmo-fx">GMOの一次案内 →</a></article>
<article><span class="status research">今回の追加勧告</span><h3>設計端末とローカルAPIも確認。</h3><p>富士電機V-SFT、電子納品物検査支援システム、Brotli同梱先、Continue・OpenBB等。製品名だけで判断せず、ファイルを開く条件、実行権限とAPI到達範囲を確認します。</p><a href="#delta">10:27以降の差分 →</a></article>
<article><span class="status research">Tailscale / headscale</span><h3>機能と許可を絞り、修正を追う。</h3><p>Tailwormの最低修正版は今回未確定。1.104.2や0.29.6を修正版と推定せず、SSH・接続許可・Serve/Funnel等を機能別に確認します。</p><a href="./tailworm.html">Tailworm特集 →</a></article>
</div></section>
<aside><strong>新しい登録は、新しい侵害の件数ではありません。</strong><p>脆弱性の公表、悪用の観測、被害の確認、修正の提供を分けます。KEV未掲載を安全の証明にせず、復旧予定を完了に読み替えません。</p></aside>
<section id="delta"><h2>10:27〜13:01：追加情報を時刻順に。</h2><p>配信・DB収録の時刻で並べています。攻撃開始時刻ではありません。NVD項目はCNA記録を入口に、公式コードや変更履歴と照合。未確定の最低修正版は推測していません。</p>'''
content += ''.join(article(r) for r in sorted((r for r in register['records'] if r['kind'] == 'delta'), key=time_key))
content += '</section><section id="incidents"><h2>国内外の既存事件：範囲と対応を補完。</h2><p>10/26に新規発生した事件という意味ではありません。公表日順に並べ、日時の確認できない資料を最後に置きます。</p>'
content += ''.join(article(r) for r in sorted((r for r in register['records'] if r['kind'] == 'scope-complement'), key=lambda r: r['date'] or '9999'))
content += '</section><section id="reference"><h2>参考：同日でも、13:01以前かは未確定。</h2><aside><strong>以下は13:01時点の確定差分に含めません。</strong><p>調査後に取得した現行本文です。公表時刻が記載されていないため、その内容を基準時刻へ遡って断定できません。</p></aside>'
content += ''.join(article(r) for r in register['records'] if r['kind'] == 'reference-only')
content += '''</section><section id="evidence"><h2>収集範囲・重複・限界。</h2>
<div class="evidence-counts"><div><strong>8</strong><span>NVD新規公開</span></div><div><strong>20</strong><span>NVD更新</span></div><div><strong>13</strong><span>GHSA・全件unreviewed</span></div><div><strong>46</strong><span>保存した応答原本</span></div></div>
<p>固定窓は10/26 10:27〜13:01 JST、全深刻度・全ページ。NVD新規8件はすべて更新20件にも含まれます。GHSA13件は今回NVDの8件と前回分5件に重複。合計して新規事件数にしません。KEVは2026.10.23版1,756件で、朝の原本とバイト単位で同じです。</p>
<p>JVN/JPCERT、CISA、Microsoft、GitHub、Unit 42、Talos、oss-sec、SANS、Project Zero等の公式・研究者フィード、国内外の当事者報告を横断。全世界の全事件の完全一覧ではありません。IPA旧URL404、研究者資料404、一部本文取得制限を記録。無記載の後日追記を基準時刻へ完全には復元できません。</p>
<p>PSGIの版境界は、CNA記述と一次勧告Solutionsの不整合が継続中。DBの番号だけで、前回の留保を消していません。</p>'''
content += '<p>' + ' / '.join([
    anchor(REPO + 'docs/research-2026-10-26-1301.md', '一次調査・全論点'),
    anchor(REPO + 'data/2026-10-26-1301/incident-register.json', '構造化索引'),
    anchor(REPO + 'data/2026-10-26-1301/collection-summary.json', 'URL・取得日時・原本ハッシュ'),
    anchor('./update-20261026.html', '10:27の記録・継続対応21群')]) + '</p></section>'
result = daily.shell('update-20261026-1301.html', '10月26日13:01 — 広域インシデント調査',
                     '13:01 JST基準。国内JVN、Brotli同梱先、AI/MCP、GMO・futureshop・Studio等を一次資料で整理。忙しい人向け要約と18論点。', content)
result = result.replace('基準 2026-10-26 10:27 JST / 01:27 UTC。', '基準 2026-10-26 13:01 JST / 04:01 UTC。')
result = result.replace('docs/29-snapshot-20261026-1027.ja.md', 'docs/research-2026-10-26-1301.md')
result = result.replace('<a href="./update-20261026-1301.html">', '<a href="./update-20261026-1301.html" aria-current="page">', 1)
(ROOT / 'site/update-20261026-1301.html').write_text(result)
print('Built 13:01 JST report: 10 delta, 7 prior-scope, 1 reference-only topics')
