"""Static impact publication. Uses the same cutoff and shell as the database."""
import json
from datetime import datetime

LABELS = {'confirmed-impact': '実被害・業務影響を確認',
          'exploitation-confirmed': '悪用確認・被害規模は不明',
          'potential': '影響の可能性・範囲は未確定'}

def tabs(active):
    links = []
    for key, title in [('database', '調査データ'), ('impact', '現実世界への影響')]:
        current = ' aria-current="page"' if active == key else ''
        links.append(f'<a href="/{key}"{current}>{title}</a>')
    return '<nav class="research-tabs" aria-label="調査の表示切り替え">'+''.join(links)+'</nav>'

def build(root, latest, shell, esc):
    record = json.loads((root/'data'/latest['impact_register']).read_text())
    if record['cutoff'] != latest['cutoff']:
        raise ValueError('Impact and incident cutoffs differ')
    seen = set()
    for row in record['records']:
        if row['id'] in seen or row['status'] not in LABELS or not row['sources']:
            raise ValueError('Invalid impact record: '+row['id'])
        seen.add(row['id'])
    site = root/'site'
    (site/'data/impact.json').write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n')
    cutoff = datetime.fromisoformat(record['cutoff_jst']).strftime('%Y-%m-%d %H:%M JST')
    body = tabs('impact')+f'''<header><p class="kicker">REAL-WORLD IMPACT</p>
<h1>画面の向こうで、何が止まり、何が失われたのか。</h1>
<p class="intro">医療予約、仕事の基盤、個人情報、お金。一次資料で確認できた現実の影響と、まだ分かっていないことを一覧にします。</p>
<p class="date">調査基準：{esc(cutoff)}。発生期間は事案ごとに異なります。今回初めて起きた事件だけの一覧ではありません。</p>
<p><a href="/data/impact.json" download>出典付きJSONをダウンロード</a> · <a href="/about">情報の読み方・編集方針</a></p></header>
<aside><strong>深刻さは、確認された生活・業務への影響から読みます。</strong>
<p>CVSSは脆弱性の技術的な深刻度で、実損額や被害者数ではありません。不明はゼロにせず、補償の上限を被害総額にせず、人数・宛先・組織・workspaceを合算しません。</p></aside>'''
    body += '<nav class="impact-index" aria-label="確認状況から移動">'
    for key, label in LABELS.items():
        count = sum(row['status'] == key for row in record['records'])
        body += f'<a href="#{key}">{label} · {count}事例</a>'
    body += '</nav>'
    for key, label in LABELS.items():
        body += f'<section id="{key}"><h2>{label}</h2>'
        for row in record['records']:
            if row['status'] != key:
                continue
            sources = ' / '.join(f'<a href="{esc(s["url"])}">{esc(s["name"])}</a>' for s in row['sources'])
            body += f'''<article class="impact-card" id="{esc(row['id'])}">
<p class="event-type">{esc(row.get('category',''))} · {esc(row.get('as_of',''))}</p>
<h3>{esc(row['title'])}</h3><dl>
<dt>確認できた影響</dt><dd>{esc(row['confirmed'])}</dd>
<dt>分かっていないこと</dt><dd>{esc(row['unknown'])}</dd>
<dt>復旧・利用者が確認すること</dt><dd>{esc(row['response'])}</dd></dl>
<p class="sources">一次資料：{sources}</p></article>'''
        body += '</section>'
    body += '<section><h2>この一覧の限界</h2><ul>'+''.join(f'<li>{esc(x)}</li>' for x in record['caveats'])+'</ul><p><a href="/database">脆弱性ごとの影響条件と修正を確認 →</a></p></section>'
    (site/'impact.html').write_text(shell('現実世界への影響 — 業務停止・情報流出・金銭被害',
        '一次資料で確認された医療予約・クラウド・個人情報・金銭への影響。実被害、悪用確認、未確定のリスクを分け、復旧状況と対策を整理。', body))
