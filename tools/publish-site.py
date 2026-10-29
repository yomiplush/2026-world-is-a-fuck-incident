#!/usr/bin/env python3
"""Apply canonical identity and discovery metadata to the generated static site.
Run after every page builder. No network or third-party dependencies.
"""
import html
from functools import lru_cache
import json
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from html.parser import HTMLParser
from pathlib import Path
import importlib.util

def sibling(name):
    spec=importlib.util.spec_from_file_location(name,Path(__file__).with_name(name+".py"))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module

impact_pages=sibling("impact_pages")
advisory_details=sibling("advisory_details")
article_languages=sibling("article_languages")
from urllib.parse import urlsplit, urlunsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
CONFIG = json.loads((ROOT/'content/site.json').read_text())
BASE = CONFIG['base_url']
LATEST = json.loads((ROOT/'data/latest.json').read_text())
REPO = 'https://github.com/yomiplush/2026-world-is-a-fuck-incident/'
OLD_HOSTS = {'infosec-briefing.yomiplush.dev','www.infosec-briefing.yomiplush.dev','infosec-briefing.net'}
LANGUAGE_ROWS = json.loads((ROOT/'content/site-languages.json').read_text())['languages']
LANGUAGES = [(row['html'],row['native']) for row in LANGUAGE_ROWS]
LANGUAGE_CODES = {row['html']:row['code'] for row in LANGUAGE_ROWS}
esc = lambda s: html.escape(str(s), quote=True)

def clean_url(url):
    u=urlsplit(url)
    if u.scheme and u.scheme not in ('http','https'):return url
    if u.netloc and u.netloc not in OLD_HOSTS | {urlsplit(BASE).netloc}:return url
    path=u.path
    if path.endswith('/index.html'):path=path[:-10]
    elif path.endswith('.html'):path=path[:-5]
    if path=='./index':path='./'
    if path=='/privacypolicy':path='/privacypolicy/'
    if u.netloc:return urlunsplit(('https',urlsplit(BASE).netloc,path or '/',u.query,u.fragment))
    return urlunsplit(('', '', path, u.query, u.fragment))

def canonical(file):
    relative=file.relative_to(SITE).as_posix()
    url=clean_url(BASE+relative)
    if relative=='tailworm.html':url+='?lang=ja'
    return url

class Info(HTMLParser):
    def __init__(self,text):
        super().__init__();self.title='';self.description='';self.language='ja';self.in_title=False;self.sources=[];self.feed(text)
    def handle_starttag(self,t,a):
        a=dict(a)
        if t=='title':self.in_title=True
        if t=='html':self.language=a.get('lang','ja')
        if t=='meta' and a.get('name')=='description':self.description=a.get('content','')
        if t=='a' and a.get('href','').startswith('https://') and urlsplit(a['href']).netloc not in OLD_HOSTS | {urlsplit(BASE).netloc}:self.sources.append(a['href'])
    def handle_endtag(self,t):
        if t=='title':self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

def shell(title,description,body):
    return f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{esc(title)} | Infosec Briefing</title><meta name="description" content="{esc(description)}"><link rel="stylesheet" href="/update.css"><link rel="stylesheet" href="/daily.css"><link rel="stylesheet" href="/privacy.css"><script defer src="/privacy.js"></script></head><body><a class="skip" href="#content">本文へ</a><main id="content"><nav class="global"><a href="/">モーション</a><a href="{esc(clean_url(LATEST['site_report']))}">最新レポート</a><a href="/database">調査データ</a><a href="/impact">現実への影響</a><a href="/timeline">日付別</a><a href="/about">編集方針</a></nav>{body}</main></body></html>'''

def language_select(rows,current,label):
    options=''.join(f'<option value="{esc(row["url"])}" data-code="{esc(row["code"])}"'+(' selected' if row['code']==current else '')+f'>{esc(row["native"])}</option>' for row in rows)
    if current is None:options='<option value="" selected disabled>—</option>'+options
    links=' · '.join(f'<a href="{esc(row["url"])}" lang="{esc(row.get("html",row["code"]))}">{esc(row["native"])}</a>' for row in rows)
    return f'<div class="language-select-control"><label>{esc(label)}<select data-language-navigation>{options}</select></label><noscript><p>{links}</p></noscript></div>'

def database_choices():
    return [dict(row,url='/database' if row['code']=='ja' else '/database.'+row['code']) for row in LANGUAGE_ROWS if (SITE/('database.html' if row['code']=='ja' else 'database.'+row['code']+'.html')).is_file()]

def extra_pages():
    about='''<header><p class="kicker">ABOUT / EDITORIAL POLICY</p><h1>このサイトと、情報の読み方。</h1><p class="intro">Infosec Briefingは、インシデント・脆弱性と対策を、公開一次資料から整理する独立した調査サイトです。</p></header>
<section><h2>運営・お問い合わせ</h2><p>運営・編集：YomiPlush（yomiplush）。開発元、行政機関、被害企業の公式発表を代行するサイトではありません。</p><p><a href="https://github.com/yomiplush">運営者のGitHub</a> · <a href="mailto:contact@yomiplush.dev">contact@yomiplush.dev</a> · <a href="/privacypolicy/">プライバシーポリシー</a></p></section>
<section><h2>確認する資料</h2><p>ベンダーの勧告、公式リリース、公開ソースコード、JVN・JPCERT/CC・IPA、NVDやGitHub Advisory Databaseなどを照合します。二次報道は手がかりとして扱い、重要な条件や対策は一次資料へ戻って確認します。</p><p>収集と整理にはAI支援を用います。出典、対象条件、不明点を記載し、必要に応じて訂正します。製品の利用環境によって影響は異なるため、最終的には公式の案内と実際の稼働版を確認してください。</p></section>
<section><h2>時刻と件数の意味</h2><p>各レポートの「基準時刻」は調査対象の区切りです。ページの公開時刻や事件の発生時刻ではありません。実際の取得は基準時刻後になることがあり、その時点の本文を保存します。</p><p>発生・検知・公表・DB登録・改訂・取得を区別します。公開時刻を確認できない同日資料は参考情報として分けます。脆弱性件数、勧告件数、論点の数を、そのまま被害事件の数にはしません。</p></section>
<section><h2>修正と復旧の確認</h2><p>ソースコードへの修正、修正版の提供、利用環境への配置、侵害調査、サービス復旧はそれぞれ異なる段階です。予定を実施済みとせず、最低修正版が不明なときは不明と記します。</p></section>
<section><h2>訂正と原本</h2><p>調査対象時刻ごとの記録を残し、新しいレポートから前回の記録へ戻れるようにします。URL・取得日時・保存本文のSHA-256・失敗した取得を公開し、後から照合できる形にします。取得原本には各権利者の権利があり、本サイト独自のライセンスへ読み替えません。</p><p>誤りや分かりにくい表現は、出典と該当ページを添えて<a href="https://github.com/yomiplush/2026-world-is-a-fuck-incident/issues">GitHub Issues</a>またはメールでお知らせください。公開の場に認証情報や未公表の個人情報を記載しないでください。</p></section>'''
    (SITE/'about.html').write_text(shell('このサイト・編集方針と訂正窓口','一次情報の選び方、基準時刻・取得時刻・件数の読み方、AI支援、運営者と訂正窓口を説明します。',about))
    register=json.loads((ROOT/'data'/LATEST['incident_register']).read_text())
    cutoff=datetime.fromisoformat(LATEST['cutoff_jst']).strftime('%Y-%m-%d %H:%M JST')
    kinds={'delta':'今回確認した登録・勧告の更新','scope-complement':'既存事案の対応・条件の補完','reference-only':'公開時刻などが未確定の参考情報'}
    body=impact_pages.tabs('database')+f'<header><p class="kicker">RESEARCH DATABASE</p><h1>インシデント・脆弱性の調査データ</h1><p class="intro">影響条件と対策を、一次資料へ戻って確認できる一覧です。</p><p class="date">最新の調査基準：{esc(cutoff)}。論点の数は新しい被害事件の件数ではありません。</p><p><a href="{esc(clean_url(LATEST["site_report"]))}">忙しい人向けの最新レポート →</a> · <a href="/about">収集・編集方針</a> · <a href="/feed.xml">更新RSS</a></p></header>'
    for kind,label in kinds.items():
        rows=[r for r in register['records'] if r['kind']==kind]
        body+=f'<section><h2>{label} · {len(rows)}論点</h2>'
        for row in rows:
            sources=' / '.join(f'<a href="{esc(s["url"])}">{esc(s["name"])}</a>' for s in row['sources'])
            body+=f'<article id="{esc(row["id"])}"><p class="event-type">{esc(row["time"])}</p><h3>{esc(row["title"])}</h3><p>{esc(row["body"])}</p><p class="action"><strong>確認すること：</strong>{esc(row["action"])}</p>{advisory_details.render(row,esc)}<p class="sources">{sources}</p></article>'
        body+='</section>'
    body+='<section><h2>機械可読データと取得原本</h2><p>JSONの条件・留保もあわせて確認してください。網羅的な全世界の被害統計ではありません。</p><ul>'
    for key in ('incident_register','collection_summary','vendor_summary'):
        if LATEST.get(key):
            p='data/'+LATEST[key];body+=f'<li><a href="{REPO}blob/main/{esc(p)}">{esc(p)}</a></li>'
    body+='</ul><h2>過去の調査</h2><ul>'
    for p in sorted((ROOT/'data').glob('*/incident-register.json'),reverse=True):
        if p.parent.name.endswith('-vendors'):continue
        r=json.loads(p.read_text());report=r.get('report',{}).get('path')
        label=r.get('cutoff_jst',r.get('cutoff',p.parent.name))
        body+=f'<li><a href="{REPO}blob/main/{p.relative_to(ROOT)}">{esc(label)}：構造化記録</a>'+(f' · <a href="/{esc(report.removesuffix(".html"))}">読むレポート</a>' if report else '')+'</li>'
    body+='</ul></section>'
    body=body.replace('</header>', '<p><a href="/data/latest.json" download>現在の調査データをJSONで取得</a> · <a href="/languages">保存したAI翻訳を読む</a></p></header>',1)
    (SITE/'data').mkdir(exist_ok=True)
    public={k:register[k] for k in ('cutoff','cutoff_jst','counts','caveats','records') if k in register}
    public['source_register']=REPO+'blob/main/data/'+LATEST['incident_register']
    public['note']='Curated topic groups; not a worldwide incident count. See original evidence and caveats.'
    (SITE/'data/latest.json').write_text(json.dumps(public,ensure_ascii=False,indent=2)+'\n')
    body=body.replace('</header>',language_select(database_choices(),'ja','言語')+'</header>',1)
    (SITE/'database.html').write_text(shell('インシデント・脆弱性の調査データと対策一覧','一次資料付きの調査データ。影響条件、対策、修正・復旧の状態を確認し、時刻別のJSONと取得原本へ戻れます。',body))
    if LATEST.get('impact_register'):impact_pages.build(ROOT,LATEST,shell,esc)
    (SITE/'404.html').write_text(shell('ページが見つかりません','ページが見つかりません。最新レポート、日付別の記録、調査データからお探しください。','<header><p class="kicker">404 / NOT FOUND</p><h1>ページが見つかりません。</h1><p>URLが変わったか、このページは公開されていません。</p><p><a href="/database">調査データから探す</a> · <a href="/timeline">日付から読む</a> · <a href="/">トップへ</a></p></header>').replace('</head>','<meta name="robots" content="noindex,follow"></head>'))

def root_reading(text):
    text=re.sub(r'<!-- reading:start -->.*?<!-- reading:end -->\n?','',text,flags=re.S)
    label=datetime.fromisoformat(LATEST['cutoff_jst']).strftime('%m/%d %H:%M JST')
    # Keep the visible entrance in sync with the same report as the database.
    report=urlsplit(LATEST['site_report']).path
    link='<a class="entry-latest" href="'+esc(report)+'" aria-label="最新記事 / Latest report '+esc(label)+'">'+esc(label.removesuffix(' JST'))+' 最新記事 ↗</a>'
    text=re.sub(r'<a class="entry-latest"[^>]*>.*?</a>\n?','',text,flags=re.S)
    impact='<a class="entry-impact" href="/impact" aria-label="現実世界への影響を読む">影響一覧 ↗</a>'
    text=re.sub(r'<a class="entry-impact"[^>]*>.*?</a>',lambda _:link+'\n'+impact,text,flags=re.S)
    text=text.replace('<title>'+Info(text).title+'</title>','<title>インシデント・脆弱性と対策 | Infosec Briefing</title>')
    text=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="'+esc(CONFIG['description']+' 最新調査：'+label)+'">',text)
    return text

@lru_cache(maxsize=1)
def database_alternates():
    # Parse each language once per build; do not reparse every page for every alternate.
    return [(Info(path.read_text()).language,canonical(path)) for path in sorted(SITE.glob('database*.html')) if path.name=='database.html' or path.name.startswith('database.')]

def metadata(file,text):
    # Public contact information must remain readable without CDN-injected JS.
    # Cloudflare documents these comments as a per-address opt-out.
    text=re.sub(r'<!--email_off-->(.*?)<!--/email_off-->',r'\1',text,flags=re.S)
    text=re.sub(r'<a\b[^>]*href=["\']mailto:[^"\']+["\'][^>]*>.*?</a>',
                lambda m:'<!--email_off-->'+m[0]+'<!--/email_off-->',text,flags=re.S|re.I)
    # The block can be regenerated repeatedly without accumulating metadata.
    text=re.sub(r'<link\b[^>]*\brel=["\'](?:icon|shortcut icon)["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<link rel="stylesheet" href="/publishing.css">','',text)
    text=re.sub(r'<!-- publication:start -->.*?<!-- publication:end -->\n?','',text,flags=re.S)
    # Canonical/OG/alternate values are wholly owned by this publisher.
    text=re.sub(r'<link\b[^>]*\brel=["\'](?:canonical|alternate)["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<meta\b[^>]*(?:property=["\'](?:og:|article:)[^"\']+["\']|name=["\']twitter:[^"\']+["\'])[^>]*>','',text,flags=re.I)
    info=Info(text);url=canonical(file);relative=file.relative_to(SITE).as_posix()
    if relative!='404.html':
        text=re.sub(r'<meta\b[^>]*name=["\']robots["\'][^>]*>','',text,flags=re.I)
    is_root=relative=='index.html';is_article=relative.startswith(('update-','tailworm'))
    webpage_type='AboutPage' if relative=='about.html' else ('CollectionPage' if relative in ('database.html','timeline.html','impact.html') else 'WebPage')
    org={'@type':'Person','@id':BASE+'about#operator','name':CONFIG['operator'],'url':CONFIG['operator_url']}
    webpage={'@type':webpage_type,'@id':url+'#page','url':url,'name':info.title,'description':info.description,'inLanguage':info.language,'isPartOf':{'@id':BASE+'#website'}}
    graph=[{'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':CONFIG['name'],'alternateName':CONFIG['alternate_name'],'publisher':{'@id':org['@id']}},org,webpage]
    if not is_root:
        graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Infosec Briefing','item':BASE},{'@type':'ListItem','position':2,'name':info.title,'item':url}]})
    if is_article:
        article={'@type':'Article','@id':url+'#article','headline':info.title,'description':info.description,'mainEntityOfPage':{'@id':url+'#page'},'inLanguage':info.language,'author':{'@id':org['@id']},'publisher':{'@id':org['@id']},'image':[BASE+CONFIG['image']],'citation':list(dict.fromkeys(info.sources))}
        # No guessed publication times: review cutoffs are not publish dates.
        graph.append(article)
    if relative=='database.html':
        graph.append({'@type':'Dataset','@id':url+'#dataset','name':'Infosec Briefing 調査記録','description':info.description,'url':url,'creator':{'@id':org['@id']},'distribution':[{'@type':'DataDownload','encodingFormat':'application/json','contentUrl':BASE+'data/latest.json'}],'isAccessibleForFree':True})
    tags=['<link rel="stylesheet" href="/publishing.css">',f'<meta property="og:site_name" content="{esc(CONFIG["name"])}">',f'<meta property="og:title" content="{esc(info.title)}">',f'<meta property="og:description" content="{esc(info.description)}">',f'<meta property="og:url" content="{esc(url)}">',f'<meta property="og:type" content="{"article" if is_article else "website"}">',f'<meta property="og:image" content="{BASE}{CONFIG["image"]}">',f'<meta property="og:image:width" content="{CONFIG["image_width"]}">',f'<meta property="og:image:height" content="{CONFIG["image_height"]}">','<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:title" content="{esc(info.title)}">',f'<meta name="twitter:description" content="{esc(info.description)}">',f'<meta name="twitter:image" content="{BASE}{CONFIG["image"]}">',f'<link rel="canonical" href="{esc(url)}">','<link rel="alternate" type="application/rss+xml" title="Infosec Briefing 更新" href="/feed.xml">','<link rel="icon" type="image/svg+xml" href="/favicon.svg">']
    if relative=='database.html' or relative.startswith('database.'):
        for language,href in database_alternates():
            tags.append(f'<link rel="alternate" hreflang="{esc(language)}" href="{esc(href)}">')
        tags.append(f'<link rel="alternate" hreflang="x-default" href="{BASE}database">')
    if relative=='languages.html' or relative=='database.html' or relative.startswith('database.'):
        tags.append('<script src="/language-select.js?v=20261026major" defer></script>')
    if relative in ('briefing.html','briefing.en.html'):
        tags.extend([f'<link rel="alternate" hreflang="ja" href="{BASE}briefing">',f'<link rel="alternate" hreflang="en" href="{BASE}briefing.en">',f'<link rel="alternate" hreflang="x-default" href="{BASE}briefing">'])
    if relative!='404.html':tags.append('<meta name="robots" content="index,follow,max-image-preview:large">')
    if relative.startswith('tailworm'):
        for lang,_ in LANGUAGES:
            code=LANGUAGE_CODES[lang]
            href=BASE+('tailworm?lang=ja' if code=='ja' else 'tailworm.'+code)
            tags.append(f'<link rel="alternate" hreflang="{lang}" href="{href}">')
        tags.append(f'<link rel="alternate" hreflang="x-default" href="{BASE}tailworm">')
    schema=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    tags.append('<script type="application/ld+json">'+schema+'</script>')
    text=text.replace('</head>','<!-- publication:start -->\n'+'\n'.join(tags)+'\n<!-- publication:end -->\n</head>')
    if not is_root and relative!='404.html' and not relative.startswith('database.') and not relative.endswith('.en.html') and not relative.startswith('impact.'):
        text=re.sub(r'<!-- editorial:start -->.*?<!-- editorial:end -->','',text,flags=re.S)
        credit='<footer class="editorial-credit"><p>編集・調査：<a href="/about">YomiPlush / Infosec Briefing</a> · <a href="/about">編集方針・訂正窓口</a> · <a href="/database">調査データ</a> · <a href="/feed.xml">RSS</a></p></footer>'
        text=text.replace('</body>','<!-- editorial:start -->'+credit+'<!-- editorial:end --></body>')
    text=re.sub(r'<!-- language-nav:start -->.*?<!-- language-nav:end -->','',text,flags=re.S)
    if relative!='404.html' and not relative.startswith('database.') and not relative.endswith('.en.html') and not relative.startswith('impact.'):
        nav='<a href="/languages">言語 / Languages</a>'
        if is_root:
            text=text.replace('<nav aria-label="読む資料">','<nav aria-label="読む資料"><!-- language-nav:start -->'+nav+' · <!-- language-nav:end -->',1)
        else:
            text=text.replace('</nav>','<!-- language-nav:start -->'+nav+'<!-- language-nav:end --></nav>',1)
    # Only links to our HTML pages change. JS/CSS/media and primary-source URLs stay intact.
    text=re.sub(r'\bhref=(["\'])(.*?)\1',lambda m:'href='+m[1]+esc(clean_url(html.unescape(m[2])))+m[1],text)
    return text

def discovery(pages):
    ns='http://www.sitemaps.org/schemas/sitemap/0.9';xhtml='http://www.w3.org/1999/xhtml'
    ET.register_namespace('',ns);ET.register_namespace('xhtml',xhtml)
    tree=ET.Element('{'+ns+'}urlset')
    for file in pages:
        if file.name in ('404.html','404.en.html'):continue
        node=ET.SubElement(tree,'{'+ns+'}url');ET.SubElement(node,'{'+ns+'}loc').text=canonical(file)
        if file.name.startswith('tailworm'):
            for lang,_ in LANGUAGES:
                code=LANGUAGE_CODES[lang]
                ET.SubElement(node,'{'+xhtml+'}link',rel='alternate',hreflang=lang,href=BASE+('tailworm?lang=ja' if code=='ja' else 'tailworm.'+code))
            ET.SubElement(node,'{'+xhtml+'}link',rel='alternate',hreflang='x-default',href=BASE+'tailworm')
    ET.indent(tree);ET.ElementTree(tree).write(SITE/'sitemap.xml',encoding='utf-8',xml_declaration=True)
    (SITE/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+BASE+'sitemap.xml\n')
    rss=ET.Element('rss',version='2.0');channel=ET.SubElement(rss,'channel')
    for key,value in [('title','Infosec Briefing — 調査レポート更新'),('link',BASE),('description',CONFIG['description']),('language','ja')]:ET.SubElement(channel,key).text=value
    cutoffs={'update-20261025.html':'2026-10-25T16:34', 'update-20261025-2318.html':'2026-10-25T23:18', 'update-20261026.html':'2026-10-26T10:27', 'update-20261026-1301.html':'2026-10-26T13:01'}
    for source in (ROOT/'data').glob('*/incident-register.json'):
        record=json.loads(source.read_text())
        if record.get('report',{}).get('path'):cutoffs[record['report']['path']]=record.get('cutoff_jst','')[:16]
    for file in sorted((p for p in SITE.glob('update-*.html') if not p.name.endswith('.en.html')),key=lambda p:cutoffs.get(p.name,p.stem),reverse=True):
        p=Info(file.read_text());item=ET.SubElement(channel,'item')
        for key,value in [('title',p.title),('link',canonical(file)),('guid',canonical(file)),('description',p.description)]:ET.SubElement(item,key).text=value
    ET.indent(rss);ET.ElementTree(rss).write(SITE/'feed.xml',encoding='utf-8',xml_declaration=True)

def main():
    extra_pages()
    root=SITE/'index.html'
    root.write_text(root_reading(root.read_text()))
    pages=sorted(SITE.rglob('*.html'))
    for file in pages:file.write_text(metadata(file,file.read_text()))
    article_languages.publish(__import__('types').SimpleNamespace(metadata=metadata,clean_url=clean_url,language_select=language_select,BASE=BASE,impact_en=bool(impact_pages.locale_package(ROOT,LATEST,"en"))))
    impact_pages.publish_locales(__import__('types').SimpleNamespace(ROOT=ROOT,LATEST=LATEST,BASE=BASE,shell=shell,esc=esc,metadata=metadata,language_select=language_select))
    pages=sorted(SITE.rglob('*.html'))
    discovery(pages)
    print(f'Published metadata, clean canonicals, structured data, RSS and sitemap for{len(pages)-1}indexable pages')

if __name__=='__main__':main()
