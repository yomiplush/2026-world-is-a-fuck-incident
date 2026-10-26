#!/usr/bin/env python3
"""Build static, script-independent dated reading pages from the editorial record.
No network or third-party packages. Historical pages describe later-known facts,
not a reconstruction of what readers knew that day.
"""
import html
import json
from datetime import datetime
from urllib.parse import urlparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
BASE = json.loads((ROOT / 'content/site.json').read_text())['base_url']
REPO = 'https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/'
DATA = ROOT / 'data/2026-10-26-1027/daily-record.json'
LATEST = json.loads((ROOT / 'data/latest.json').read_text())
LATEST_PATH = Path(urlparse(LATEST['site_report']).path).name
LATEST_LABEL = datetime.fromisoformat(LATEST['cutoff_jst']).strftime('%m/%d %H:%M')

def esc(value):
    return html.escape(str(value), quote=True)

def anchor(url, text):
    return f'<a href="{esc(url)}">{esc(text)}</a>'

def shell(path, title, description, content):
    return f'''<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#070b12">
<title>{esc(title)} — October Incident Briefing</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="{BASE}{path}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:type" content="article"><meta property="og:url" content="{BASE}{path}">
<link rel="stylesheet" href="./update.css"><link rel="stylesheet" href="./daily.css?v=20261026"><link rel="stylesheet" href="/privacy.css?v=20261027gdpr"><script src="/privacy.js?v=20261027gdpr" defer></script></head>
<body><a class="skip" href="#content">本文へ</a><main id="content"><nav class="global" aria-label="サイト内">{anchor('./','モーションブリーフィング')} {anchor('./'+LATEST_PATH,LATEST_LABEL+' 最新まとめ')} {anchor('./update-20261026.html','10:27 朝の記録')} {anchor('./timeline.html','日付から読む')} {anchor('./tailworm.html','Tailworm特集')}</nav>
{content}
<footer>{anchor('./timeline.html','日付別一覧')} · {anchor(REPO+'docs/29-snapshot-20261026-1027.ja.md','調査範囲・全文・出典')} · {anchor('/privacypolicy','プライバシーポリシー')}<p>基準 2026-10-26 10:27 JST / 01:27 UTC。取得は基準後。更新後の本文を過去時点へ完全には復元できません。</p></footer></main></body></html>'''

def nav_dates(days, current=''):
    return '<nav class="dates" aria-label="日付別ページ">' + ''.join(
        f'<a href="./day-{d["date"].replace("-", "")}.html"'+(' aria-current="page"' if d['date']==current else '')+f'>{esc(d["date"][5:].replace("-", "/"))}</a>' for d in days) + '</nav>'

def article(event):
    sources = ' / '.join(anchor(s['url'], s['name']) for s in event['sources'])
    return f'''<article><p class="event-type">{esc(event['kind'])} · {esc(event['time'])}</p><h2>{esc(event['title'])}</h2><p>{esc(event['body'])}</p><p class="action"><strong>確認すること</strong> {esc(event['action'])}</p><p class="sources">{sources}</p></article>'''

def main():
    record = json.loads(DATA.read_text())
    days = record['days']
    cards = ''.join(f'''<a class="day-card" href="./day-{d['date'].replace('-','')}.html"><time datetime="{d['date']}">{d['date'][5:].replace('-','/')}</time><div><strong>{esc(d['title'])}</strong><p>{esc(d['summary'])}</p></div><span aria-hidden="true">↗</span></a>''' for d in days)
    reviews = []
    for path in (ROOT / 'data').glob('*/incident-register.json'):
        review_record = json.loads(path.read_text())
        if review_record.get('report'):
            reviews.append(review_record)
    review_cards = ''
    for review_record in sorted(reviews, key=lambda r: r['cutoff']):
        report = review_record['report']
        stamp = datetime.fromisoformat(review_record['cutoff_jst']).strftime('%m/%d %H:%M')
        review_cards += f'<a class="day-card" href="./{esc(report["path"])}"><time datetime="{esc(review_record["cutoff_jst"])}">{esc(stamp[:5])}<small>{esc(stamp[6:])} JST</small></time><div><strong>{esc(report["headline"])}</strong><p>{esc(report["intro"])}</p></div><span aria-hidden="true">↗</span></a>'
    cards += '<h2>追補レポート：調査の基準時刻順</h2><p>基準時刻は事件の発生時刻ではありません。各回の差分と継続対応を確認できます。</p>' + review_cards
    intro = '''<header><p class="kicker">OCTOBER 17—26 · DAILY RECORD</p><h1>何が起きて、<br>何が変わったか。</h1><p class="date">古い日付 → 新しい日付の順。8月からの背景はモーション版に収録。</p><p class="intro">PHPの公開前の試行から、修正の波及、資格情報の侵害、今朝の更新まで。日付ごとに読み、いま必要な対応へ戻れます。</p><p class="date">2026-10-26 10:27 JST 基準 · 日本語 / Japanese</p></header>
<aside><strong>事件の日付と、判明した日付。</strong><p>観測・公表・修正・収録・本調査の更新を区別しています。過去のページも現在確認できる資料による振り返りです。PHPがほかの事件を引き起こしたという関係は示しません。時刻のある情報はJSTへ換算。時刻未記載の資料は原資料の日付に置き、日付境界は未確定と明記します。</p></aside>'''
    (SITE/'timeline.html').write_text(shell('timeline.html','10月17日〜26日 — 日付から読む','PHP2Shellの公開前試行以降を日付別10ページに整理。攻撃観測、公表、修正、後日判明を区別し、10月26日10:27 JSTの対応へ。',intro+'<section class="day-list" aria-label="日付別記録">'+cards+'</section>'))
    for index, day in enumerate(days):
        filename = 'day-' + day['date'].replace('-','') + '.html'
        previous = anchor('./day-'+days[index-1]['date'].replace('-','')+'.html','← 前の日') if index else '<span>記録の起点</span>'
        following = anchor('./day-'+days[index+1]['date'].replace('-','')+'.html','次の日 →') if index+1<len(days) else anchor('./'+LATEST_PATH,'現在の対応へ →')
        content = nav_dates(days,day['date'])+f'''<header><p class="kicker">DAILY RECORD · {esc(day['date'])}</p><h1><span class="day-number">{esc(day['date'][5:].replace('-','/'))}</span>{esc(day['title'])}</h1><p class="intro">{esc(day['summary'])}</p><p class="date">10/26 10:27 JST時点の振り返り。原資料の日付のみの項目は厳密なJST日付が未確定です。</p></header>'''
        content += ''.join(article(e) for e in day['events'])
        content += f'<aside><strong>当日の記録と、今の対策は分けて確認。</strong><p>{esc(day["now"])}</p>{anchor("./"+LATEST_PATH,"最新の対応優先度を読む →")}</aside>'
        content += f'<nav class="siblings" aria-label="前後の日">{previous}{following}</nav>'
        (SITE/filename).write_text(shell(filename,day['date']+' — '+day['title'],day['summary'],content))
    review = '''<header><p class="kicker">SECURITY REVIEW · 2026-10-26 10:27 JST</p><h1>修正の先まで、<br>確認する朝。</h1><p class="intro">PHP以降の事案を広範囲に再確認。欠落していた.NET修正、機器への波及、資格情報の侵害と、訂正された説明をまとめました。</p><p class="date">対象：2026-10-26 10:27 JST / 01:27 UTC。実取得は基準後。<br>「現在起きていること」は継続対応を含み、今朝発生した事件だけを指しません。</p><div class="report-links"><a href="./timeline.html">10日分を日付から読む →</a><a href="./?lang=ja#49">今朝の4画面を再生 →</a><a href="./tailworm.html">Tailworm特集 →</a></div></header>
<aside><strong>最初の確認：該当するか、到達できるか、悪用されたか。</strong><p>外部公開サービスと実悪用が確認された製品の更新・侵害調査を継続。漏れた鍵や追加された権限は失効・除去まで追います。新しい話題で、以前から必要な作業を止めないでください。</p></aside>
<section><h2>この朝に変わった判断</h2><p>次の4項目は、修正提供・公開情報・調査説明の差分です。公表時刻と攻撃開始時刻を区別しています。</p>'''
    review += ''.join(article(e) for e in days[-1]['events'][:4]) + '</section>'
    review += '<section><h2>前日分の状態変更と、既公表事件の補完</h2>'
    review += article(days[-2]['events'][-1]) + article(days[2]['events'][0]) + '</section>'
    review += '''<section><h2>継続対応の優先度</h2><div class="priority-grid"><article><span class="status confirmed">1 · 公開面と実悪用</span><h2>更新と侵害調査を並行。</h2><p>PHP・GitLab・Arista・CODE・Plex・SiteGuard等。公開到達性、対象構成と稼働版を確認。パッチが入っても、既存の侵入が消えた証拠にはなりません。</p></article><article><span class="status confirmed">2 · 鍵とクラウド権限</span><h2>復旧後も、鍵は残る。</h2><p>LiteLLM・Railway・ConnectWise等。ログを保存し、漏れた鍵、追加所有者、権限と同意まで確認。自分のアプリ外で使われた鍵はprovider側のログへ。</p></article><article><span class="status research">3 · 同梱物と機器</span><h2>実行しているものを確認。</h2><p>.NETのself-contained、Brotli、JRE、certifi、カーネル、PAN-OSを含む機器。ソース修正や更新のダウンロードだけで完了としません。</p></article><article><span class="status research">4 · 研究報告と未確定</span><h2>成立条件を、狭める。</h2><p>Tailworm・AI/MCP等は権限、機能、入力経路から照合。最低修正版未確定や番号不整合を隠さず、不要な許可と公開を削減します。</p></article></div></section>'''
    review += '<section><h2>製品・事案別の対応表</h2><p>過去の重要事項を含む21群。21件の新規侵害という集計ではありません。各行の出典に対象条件・系列別修正と留保を記録しています。</p><div class="table-scroll" tabindex="0" role="region" aria-label="製品別の条件・対応・証拠"><table class="report-table"><thead><tr><th scope="col">対象</th><th scope="col">条件と現在の見方</th><th scope="col">確認する対応</th><th scope="col">証拠・詳細</th></tr></thead><tbody>'
    for row in record['continuity']:
        url = REPO+'docs/'+row['doc']+('.md' if row['doc'].startswith('research-') else '.ja.md')
        review += f'<tr><th scope="row">{esc(row["product"])}</th><td>{esc(row["condition"])}</td><td>{esc(row["action"])}</td><td><span class="status">{esc(row["status"])}</span><p>{anchor(url,"出典・条件別の詳細")}</p></td></tr>'
    review += '</tbody></table></div></section>'
    if record.get('ai_addendum'):
        review += '<section><h2>追加点検：AI / MCPと非信頼入力</h2><p>新しいCVE収録と、以前に公表された研究の再確認。以下の全件を実被害確認とは扱いません。</p>'+''.join(article(e) for e in record['ai_addendum'])+'</section>'
    review += '''<section><h2>集計：登録数は、事件数ではない。</h2><div class="evidence-counts"><div><strong>28</strong><span>NVD新規公開</span></div><div><strong>4,276</strong><span>NVD更新・全3ページ</span></div><div><strong>93</strong><span>GHSA・全件unreviewed</span></div><div><strong>1,756</strong><span>KEV・前回と同一原本</span></div></div><p>固定窓：10/25 23:18〜10/26 10:27 JST。NVD新規28件はすべて更新4,276件に含まれます。GHSA93件のうち73件は前回のNVD新規集合に既出。足し算して新規事件数にしません。KEV未掲載も悪用されていない証明にはなりません。</p>
<p>全深刻度のNVD、GitHub Advisory API、CISA公式ミラー、国内注意喚起、開発元、研究者・公式フィードを照合。45応答原本の展開後SHA-256を確認しました。フィード範囲外、非公開事件、取得後の無記載の変更は網羅できません。IPA旧URL404とReddit API403は記録し、失敗を「問題なし」へ読み替えていません。</p>'''
    review += '<p>'+anchor(REPO+'docs/research-collection-2026-10-26-1027.md','収集範囲・重複・失敗の記録')+' / '+anchor(REPO+'docs/research-2026-10-26-1027.md','一次情報の追加調査')+' / '+anchor('https://github.com/yomiplush/2026-world-is-a-fuck-incident/tree/main/data/2026-10-26-1027','原本・URL・取得日時・ハッシュ')+'</p></section>'
    review += '<section><h2>時系列で振り返る</h2>'+nav_dates(days)+'<p>'+anchor('./update-20261025-2318.html','前回：10/25 23:18 夜間調査')+' / '+anchor('./update-20261025.html','10/25 16:34 広域調査')+'</p></section>'
    (SITE/'update-20261026.html').write_text(shell('update-20261026.html','10月26日10:27 — 広域セキュリティ総まとめ','PHP以降の継続対応と.NET臨時更新、Siemens・PAN-OS、Perl、調査説明の撤回。21群の対応表、日付別10ページと一次情報付き。',review))
    print(f'Built latest review, timeline.html and {len(days)} dated pages')

if __name__ == '__main__':
    main()
