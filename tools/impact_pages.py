"""Static impact publication using validated, source-matched locale packages."""
import importlib.util
import json
from datetime import datetime

COPY = {
 'title':'現実世界への影響 — 業務停止・情報流出・金銭被害',
 'description':'一次資料で確認された医療予約・クラウド・個人情報・金銭への影響。実被害、悪用確認、未確定のリスクを分け、復旧状況と対策を整理。',
 'headline':'画面の向こうで、何が止まり、何が失われたのか。',
 'intro':'医療予約、仕事の基盤、個人情報、お金。一次資料で確認できた現実の影響と、まだ分かっていないことを一覧にします。',
 'cutoff':'調査基準',
 'date_note':'発生期間は事案ごとに異なります。今回初めて起きた事件だけの一覧ではありません。',
 'download':'出典付きJSONをダウンロード','about':'情報の読み方・編集方針',
 'guide_title':'深刻さは、確認された生活・業務への影響から読みます。',
 'guide_body':'CVSSは脆弱性の技術的な深刻度で、実損額や被害者数ではありません。不明はゼロにせず、補償の上限を被害総額にせず、人数・宛先・組織・workspaceを合算しません。',
 'jump':'確認状況から移動','confirmed-impact':'実被害・業務影響を確認',
 'exploitation-confirmed':'悪用確認・被害規模は不明','potential':'影響の可能性・範囲は未確定',
 'examples':'事例','confirmed':'確認できた影響','unknown':'分かっていないこと',
 'response':'復旧・利用者が確認すること','sources':'一次資料',
 'limitations':'この一覧の限界','database_link':'脆弱性ごとの影響条件と修正を確認 →',
 'database_tab':'調査データ','impact_tab':'現実世界への影響','home':'モーションへ',
 'language':'言語を選ぶ','original':'日本語の原文',
 'notice':'CodexによるAI翻訳です。母語話者による校閲は行われていません。製品名、版、設定と対策は原文・公式案内と照合してください。',
 'advisory_versions':'勧告別：対象バージョンと修正版','affected':'対象','fixed':'修正版','no_fix':'修正版の記載なし'
}
LABELS={key:COPY[key]for key in ('confirmed-impact','exploitation-confirmed','potential')}

def tabs(active, lang='ja', labels=None):
    names=labels or {'database_tab':'Research database' if lang=='en' else '調査データ','impact_tab':'Real-world impacts' if lang=='en' else '現実世界への影響'}
    links=[]
    for key in ('database','impact'):
        current=' aria-current="page"' if active==key else ''
        links.append(f'<a href="/{key}{"" if lang=="ja" else "."+lang}"{current}>{names[key+"_tab"]}</a>')
    return '<nav class="research-tabs" aria-label="Research views">'+''.join(links)+'</nav>'

def locale_package(root,latest,code):
    folder=root/'data/impact-translations'/latest['impact_register'].split('/')[0]
    source_path=folder/'source.json';package_path=folder/(code+'.json')
    if not source_path.exists() or not package_path.exists():return None
    source=json.loads(source_path.read_text());package=json.loads(package_path.read_text())
    spec=importlib.util.spec_from_file_location('impact_validator',root/'tools/translations/manage.py');manager=importlib.util.module_from_spec(spec);spec.loader.exec_module(manager)
    manager.STORE=root/'data/impact-translations'
    if source.get('cutoff')!=latest['cutoff'] or source['register_hash']!=manager.sha((root/'data'/latest['impact_register']).read_text()):return None
    if package.get('locale')!=code or package.get('status')not in ('source','translated') or not manager.is_current(source,package):return None
    try:manager.validate(source,package['strings'],code)
    except (KeyError,ValueError):return None
    # Materialize from the current original, rather than trusting a detached cached object.
    record=manager.materialize(source,package['strings'])
    ui={k:package['strings']['ui.'+k]for k in COPY}
    return record,ui,source,package

def build(root,latest,shell,esc,record=None,ui=None,code='ja',language=None,selector=''):
    record=record or json.loads((root/'data'/latest['impact_register']).read_text())
    ui=ui or COPY
    if record['cutoff']!=latest['cutoff']:raise ValueError('Impact and incident cutoffs differ')
    seen=set()
    for row in record['records']:
        if row['id']in seen or row['status']not in LABELS or not row['sources']:raise ValueError('Invalid impact record: '+row['id'])
        seen.add(row['id'])
    site=root/'site';suffix=''if code=='ja'else'.'+code
    (site/'data'/('impact'+suffix+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    cutoff=datetime.fromisoformat(record['cutoff_jst']).strftime('%Y-%m-%d %H:%M JST')
    database='/database'+suffix;about='/about'if code=='ja'else'/about.en'
    colon='：'if code=='ja'else': '
    stop='。'if code=='ja'else'. '
    body=tabs('impact',code,{k:esc(v)for k,v in ui.items()})+f'''<header><p class="kicker">REAL-WORLD IMPACT</p>
<h1>{esc(ui['headline'])}</h1>
<p class="intro">{esc(ui['intro'])}</p>
<p class="date">{esc(ui['cutoff'])}{colon}<bdi dir="ltr">{esc(cutoff)}</bdi>{stop}{esc(ui['date_note'])}</p>
<p><a href="/data/impact{suffix}.json" download>{esc(ui['download'])}</a> · <a href="{about}">{esc(ui['about'])}</a></p>{selector}</header>
<aside><strong>{esc(ui['guide_title'])}</strong><p>{esc(ui['guide_body'])}</p></aside>'''
    body+='<nav class="impact-index" aria-label="'+esc(ui['jump'])+'">'
    for key in LABELS:
        count=sum(row['status']==key for row in record['records'])
        body+=f'<a href="#{key}">{esc(ui[key])} · {count} {esc(ui["examples"])}</a>'
    body+='</nav>'
    for key in LABELS:
        body+=f'<section id="{key}"><h2>{esc(ui[key])}</h2>'
        for row in record['records']:
            if row['status']!=key:continue
            sources=' / '.join(f'<a href="{esc(s["url"])}">{esc(s["name"])}</a>'for s in row['sources'])
            body+=f'''<article class="impact-card" id="{esc(row['id'])}"><p class="event-type">{esc(row.get('category',''))} · {esc(row.get('as_of',''))}</p>
<h3>{esc(row['title'])}</h3><dl>
<dt>{esc(ui['confirmed'])}</dt><dd>{esc(row['confirmed'])}</dd>
<dt>{esc(ui['unknown'])}</dt><dd>{esc(row['unknown'])}</dd>
<dt>{esc(ui['response'])}</dt><dd>{esc(row['response'])}</dd></dl>
<p class="sources">{esc(ui['sources'])}{colon}{sources}</p></article>'''
        body+='</section>'
    body+='<section><h2>'+esc(ui['limitations'])+'</h2><ul>'+''.join(f'<li>{esc(x)}</li>'for x in record['caveats'])+f'</ul><p><a href="{database}">{esc(ui["database_link"])}</a></p></section>'
    page=shell(ui['title'],ui['description'],body)
    if code!='ja':
        page=page.replace('<html lang="ja">',f'<html lang="{esc(language["html"])}" dir="{esc(language["dir"])}">',1)
        start=page.index('<nav class="global">');end=page.index('</nav>',start)+6
        nav=f'<nav class="global"><a href="/">{esc(ui["home"])}</a><a href="{database}">{esc(ui["database_tab"])}</a><a href="/impact">{esc(ui["original"])}</a></nav>'
        page=page[:start]+nav+page[end:];page=page.replace('本文へ',esc(ui['headline']),1)
    target=site/('impact'+suffix+'.html');target.write_text(page)
    return target

def publish_locales(pub):
    root=pub.ROOT;latest=pub.LATEST
    catalog=json.loads((root/'content/site-languages.json').read_text())['languages']
    ready={row['code']:locale_package(root,latest,row['code'])for row in catalog}
    # Remove retired catalog languages as well as stale active translations.
    import re
    for path in list((root/'site').glob('impact.*.html'))+list((root/'site/data').glob('impact.*.json')):
        match=re.match(r'impact\.([a-z]{2})\.',path.name)
        if match and match[1] not in ready:path.unlink(missing_ok=True)
    # Never leave obsolete translations reachable or indexed after a source change.
    for code,item in ready.items():
        if code=='ja' or item:continue
        (root/'site'/('impact.'+code+'.html')).unlink(missing_ok=True)
        (root/'site/data'/('impact.'+code+'.json')).unlink(missing_ok=True)
    choices=[dict(row,url='/impact'+(''if row['code']=='ja'else'.'+row['code']))for row in catalog if ready[row['code']]]
    for row in catalog:
        code=row['code'];localized=ready[code]
        if not localized:continue
        record,ui,source,package=localized
        if code!='ja':record=dict(record,locale=code,translation={'source_hash':source['source_hash'],'register_hash':source['register_hash'],'human_reviewed':False})
        selector=pub.language_select(choices,code,ui['language'])
        if code!='ja':selector+='<p class="translation-notice">'+pub.esc(ui['notice'])+'</p>'
        path=build(root,latest,pub.shell,pub.esc,record,ui,code,row,selector)
        text=pub.metadata(path,path.read_text())
        text=__import__('re').sub(r'<link\b[^>]*\bhreflang=["\'][^>]*>','',text)
        alternates=''.join(f'<link rel="alternate" hreflang="{pub.esc(x["html"])}" href="{pub.BASE.rstrip("/")+x["url"]}">'for x in choices)
        text=text.replace('</head>',alternates+f'<link rel="alternate" hreflang="x-default" href="{pub.BASE}impact"><script src="/language-select.js" defer></script></head>')
        path.write_text(text)
    count=sum(bool(v)for v in ready.values())
    print('Impact language pages:',count,'/',len(catalog))
    return count
