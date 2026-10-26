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
# Only validated, source-matched packages become public pages.
mspec=importlib.util.spec_from_file_location('translation_manager',ROOT/'tools/translations/manage.py');manager=importlib.util.module_from_spec(mspec);mspec.loader.exec_module(manager)
translation_source,targets=manager.prepare();manifest=manager.manifest(translation_source,targets)
record=json.loads((ROOT/'data'/translation_source['register']).read_text())
topic_count=len(record['records']);ready=[];esc=pub.esc
bcp=lambda code:{'iw':'he','jw':'jv','zh-CN':'zh-Hans','zh-TW':'zh-Hant','pt':'pt-BR'}.get(code,code)
rtl={'ar','fa','iw','ur','ps','sd','ug','dv','ckb','bal','ks','fa-AF','pa-Arab','bm-Nkoo'}
outdir=SITE/'data/translations'/translation_source['snapshot'];outdir.mkdir(parents=True,exist_ok=True)
for code,state in manifest['languages'].items():
 if state['status'] not in ('source','translated'):continue
 package=json.loads((ROOT/state['file']).read_text());values=package['strings'];t=lambda key:esc(values[key])
 target=state['language'];ready.append(dict(target,native=package.get('language_native',target.get('native',target['en'])),status=state['status'],url='/database' if code=='ja' else '/database.'+code))
 (outdir/(code+'.json')).write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
 if code=='ja':continue
 body=f'<header><p class="kicker">INFOSEC BRIEFING</p><h1>{t("ui.title")}</h1><p class="intro">{t("ui.intro")}</p><p>{t("ui.cutoff")}: <bdi>{esc(record["cutoff_jst"])}</bdi></p><p>{t("ui.counts")}</p><aside class="translation-notice">{t("ui.notice")}</aside><p><a href="/database" lang="ja">{t("ui.original")}</a> · <a href="/languages" data-language-picker aria-haspopup="dialog">{t("ui.languages")}</a> · <a href="/data/translations/{esc(translation_source["snapshot"])}/{esc(code)}.json" download>{t("ui.data")}</a></p></header>'
 for kind in ('delta','scope-complement','reference-only'):
  rows=[r for r in record['records'] if r['kind']==kind];body+=f'<section><h2>{t("ui."+kind)} · {len(rows)}</h2>'
  for row in rows:
   prefix='records.'+row['id']+'.';sources=' / '.join(f'<a href="{esc(x["url"])}" dir="auto">{esc(x["name"])}</a>' for x in row['sources'])
   body+=f'<article id="{esc(row["id"])}"><p class="event-type">{t(prefix+"time")}</p><h3>{t(prefix+"title")}</h3><p>{t(prefix+"body")}</p><p class="action"><strong>{t("ui.actions")}: </strong>{t(prefix+"action")}</p><p class="sources">{t("ui.sources")}: {sources}</p></article>'
  body+='</section>'
 body+='<section><ul>'+''.join('<li>'+t('caveats.'+str(i))+'</li>' for i in range(len(record.get('caveats',[]))))+'</ul>'
 body+=f'<p><a href="{pub.REPO}blob/main/data/{esc(translation_source["register"])}">{t("ui.evidence")}</a></p></section>'
 # A translated page has no Japanese navigation or editorial footer inserted into its body.
 page=pub.shell(values['ui.title'],values['ui.intro'],body)
 page=page.replace('<html lang="ja">',f'<html lang="{esc(bcp(code))}" dir="{"rtl" if code in rtl else "ltr"}">',1)
 page=page.replace('本文へ',t('ui.title'),1)
 a=page.index('<nav class="global">');z=page.index('</nav>',a)+6
 page=page[:a]+f'<nav class="global"><a href="/">{t("ui.home")}</a><a href="/database">{t("ui.original")}</a></nav>'+page[z:]
 (SITE/('database.'+code+'.html')).write_text(page)
# Remove stale generated locale pages and stale public packages, rather than serving obsolete translations.
valid_codes={r['code'] for r in ready}
for path in SITE.glob('database.*.html'):
 if path.name[len('database.'):-len('.html')] not in valid_codes:path.unlink()
for path in outdir.glob('*.json'):
 if path.stem not in valid_codes and path.name!='manifest.json':path.unlink()
public_manifest={k:manifest[k] for k in ('snapshot','source_hash','register_hash','target_count','ready_count','note')}
public_manifest['languages']=[dict(state['language'],status=state['status'],url=('/database' if code=='ja' else '/database.'+code) if code in valid_codes else None) for code,state in manifest['languages'].items()]
(outdir/'manifest.json').write_text(json.dumps(public_manifest,ensure_ascii=False,indent=2)+'\n')
catalog={'languages':source['languages'],'local':local,'ready':ready,'readyCount':manifest['ready_count'],'targetCount':len(targets),'snapshot':translation_source['snapshot'],'topicCount':topic_count}
(SITE/'language-catalog.js').write_text('/* Stored, source-matched Codex translations; no external translation service. */\nwindow.LANGUAGE_CATALOG='+json.dumps(catalog,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n')
body=f'<header><p class="kicker">LANGUAGES</p><h1>言語を選んで読む。</h1><p class="intro">Codexで翻訳したデータを、サイト内で読める形で保存しています。</p><p>最新{topic_count}論点と条件・対策・留保の本文が対象です。過去の全資料やモーションの全画面が249言語に翻訳された状態ではありません。</p><p><strong>{manifest["ready_count"]} / {len(targets)} 言語のデータを公開中</strong>（日本語原文を含む）。一覧は名前・コードで検索できます。</p><p>AI翻訳には誤りが含まれます。母語話者による校閲は未実施です。CVE番号・数値・版・URLを保護して検査していますが、意味の正確さを保証する検査ではありません。実際の対策は原文と公式案内を照合してください。</p></header>'
body+=f'<section><h2>保存済みの翻訳を読む</h2><p><a href="/data/translations/{esc(translation_source["snapshot"])}/manifest.json">翻訳の進捗・出典ハッシュをJSONで取得</a></p><ul class="language-directory">'
for row in sorted(ready,key=lambda r:r['en']):body+=f'<li><a href="{esc(row["url"])}" lang="{esc(bcp(row["code"]))}"><bdi>{esc(row.get("native") or row["en"])}</bdi><small>{esc(row["en"])} · {esc(row["code"])}</small></a></li>'
body+='</ul></section><section><h2>準備中・生成できなかった言語</h2><p>249言語を対象にしていますが、未完成のデータを別の言語で埋めて公開することはありません。</p>'
groups=defaultdict(list)
for row in source['languages']:
 if row['code'] not in valid_codes:groups[row['en'][0].upper()].append(row)
for letter,rows in sorted(groups.items()):
 body+=f'<details class="language-directory-group"><summary>{esc(letter)} · {len(rows)}</summary><ul>'
 for row in sorted(rows,key=lambda r:r['en']):
  state=manifest['languages'][row['code']]['status'];body+=f'<li>{esc(row["en"])} · {esc(row["ja"])} · {esc(row["code"])} <small>({esc(state)})</small></li>'
 body+='</ul></details>'
body+=f'</section><section><h2>モーションとTailworm</h2><p>既存の12言語表示は、保存するデータベース翻訳とは別の機能です。モーションの一部の追加画面は英語になる場合があります。</p><p><a href="/">モーションへ</a> · <a href="/tailworm?lang=ja">Tailworm特集</a> · <a href="/briefing">全{scene_count}画面の日本語本文</a> · <a href="/briefing.en">English transcript</a></p></section>'
(SITE/'languages.html').write_text(pub.shell('保存したAI翻訳・言語一覧',f'249言語を対象にCodexで翻訳データを保存。現在{manifest["ready_count"]}言語の最新調査を読めます。',body))
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
print(f'Built {len(ready)}/{language_count} stored-language pages and2full {scene_count}-scene transcripts')
