#!/usr/bin/env python3
"""Build a no-JS language directory, lazy catalog and Canvas-text transcripts."""
import importlib.util,json,subprocess
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlencode
ROOT=Path(__file__).resolve().parents[1];SITE=ROOT/'site'
spec=importlib.util.spec_from_file_location('publication',ROOT/'tools/publish-site.py');pub=importlib.util.module_from_spec(spec);spec.loader.exec_module(pub)
source=json.loads((ROOT/'content/google-translate-languages.json').read_text())
export=json.loads(subprocess.check_output(['node',str(ROOT/'tools/export-briefing.cjs')],cwd=ROOT))
scene_count=len(export['scenes']);language_count=len(source['languages'])
local=[{'code':r['code'],'native':r['native'],'en':next((x['en'] for x in source['languages'] if x['code']==('zh-CN' if r['code']=='zh' else r['code'])),r['native']),'ja':next((x['ja'] for x in source['languages'] if x['code']==('zh-CN' if r['code']=='zh' else r['code'])),r['native'])} for r in export['languages']]
catalog={'languages':source['languages'],'local':local,'retrievedAt':source['retrievedAt'],'sourceURL':source['sourceURL']}
(SITE/'language-catalog.js').write_text('/* Google Translate consumer targets; fetched from its public language picker. */\nwindow.LANGUAGE_CATALOG='+json.dumps(catalog,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n')
esc=pub.esc
body=f'''<header><p class="kicker">LANGUAGES / TRANSLATION</p><h1>言語を選んで読む。</h1><p class="intro">サイト内の12言語表示と、Google翻訳の{len(source['languages'])}言語への入口を用意しています。</p><p>各ページの「言語」から、名前やコードで検索できます。下の一覧はJavaScriptなしでも使えます。</p></header>
<section><h2>サイト内の表示</h2><p>モーションとTailworm特集は12言語を選べます。モーションの一部の追加画面は英語表示になる場合があります。読むレポートの原文は日本語です。</p><p><a href="/">モーションへ</a> · <a href="/tailworm?lang=ja">Tailworm特集へ</a> · <a href="/briefing">全{scene_count}画面の日本語本文</a> · <a href="/briefing.en">English transcript</a></p></section>
<section><h2>Google翻訳で読む · {len(source['languages'])}言語</h2><p>下のリンクは、<a href="{esc(pub.clean_url(pub.LATEST['site_report']))}">最新レポート</a>を選んだ言語で別タブに開きます。他のページでは、そのページの「言語」をご利用ください。ページURLがGoogleへ送られます。</p><p>自動翻訳には誤りが含まれることがあります。製品名・版・設定・対策は原文と照合してください。Canvas上の文字は直接翻訳できないため、モーションの内容は文章版へ案内します。利用できる機能は地域・言語やGoogle側の提供状況により異なります。</p><p><a href="https://support.google.com/translate/answer/2534559">Google翻訳の公式案内</a> · 一覧取得：{esc(source['retrievedAt'])[:10]}</p>'''
groups=defaultdict(list)
for row in source['languages']:groups[row['en'][0].upper()].append(row)
for letter,rows in sorted(groups.items()):
 body+=f'<details class="language-directory-group"><summary>{esc(letter)} · {len(rows)} languages</summary><ul class="language-directory">'
 for row in sorted(rows,key=lambda r:r['en']):
  href='https://translate.google.com/translate?'+urlencode({'sl':'auto','tl':row['code'],'u':pub.clean_url(pub.LATEST['site_report'])})
  body+=f'<li><a href="{esc(href)}" target="_blank" rel="noopener noreferrer" translate="no">{esc(row["en"])}<small>{esc(row["ja"])} · {esc(row["code"])}</small></a></li>'
 body+='</ul></details>'
body+='</section>'
(SITE/'languages.html').write_text(pub.shell('言語・Google翻訳の一覧',f'サイト内12言語とGoogle翻訳{language_count}言語への検索できる入口。モーションの文章版、原文と自動翻訳の違いを案内します。',body))
for lang in ('ja','en'):
 ja=lang=='ja';title='モーション全画面の文章版' if ja else 'Full motion briefing transcript'
 intro=f'全{scene_count}画面の文章・数値・出典を、時系列順に読めます。画面番号のリンクは元のモーションに戻ります。' if ja else f'Read the text, figures and sources of all {scene_count} motion scenes in chronological order. Scene-number links return to the original motion.'
 body=f'<header><p class="kicker">MOTION BRIEFING / TRANSCRIPT</p><h1>{title}</h1><p class="intro">{intro}</p><p><a href="/briefing" lang="ja">日本語</a> · <a href="/briefing.en" lang="en">English</a> · <a href="/languages">Languages / 言語</a></p><p>{"各画面は記載日の調査記録です。現在の対策は最新レポートで確認してください。" if ja else "Each scene retains its dated context. Use the latest report for current actions."}</p></header>'
 for scene in export['scenes']:
  copy=scene[lang];n=scene['number'];sources=' / '.join(f'<a href="{esc(s["url"])}">{esc(s["name"])}</a>' for s in scene.get('sources',[]))
  body+=f'<article id="scene-{n}"><p class="event-type">{esc(scene["stamp"])} · <a href="/?lang={lang}#{n}">{"画面" if ja else "Scene"} {n}</a></p><h2>{esc(copy["title"])}</h2><p>{copy.get("lede","")}</p><ul>'+''.join('<li>'+point+'</li>' for point in copy.get('points',[]))+'</ul>'
  if scene.get('metric'):
   metric=scene['metric'];body+=f'<p><strong>{esc(metric["val"])}</strong> {esc(metric["label"].get(lang,""))}</p>'
  body+=f'<p class="sources">{sources}</p></article>'
 page=pub.shell(title,intro,body)
 if not ja:page=page.replace('<html lang="ja">','<html lang="en">',1)
 (SITE/('briefing.html' if ja else 'briefing.en.html')).write_text(page)
print(f'Built {language_count}-language directory, lazy catalog and2full {scene_count}-scene transcripts')
