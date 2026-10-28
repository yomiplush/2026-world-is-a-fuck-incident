#!/usr/bin/env python3
"""Build a no-JS language directory, native language selects and Canvas-text transcripts."""
import importlib.util,json,re,subprocess
from pathlib import Path

def validated_archive(manager,current,code):
 """Return the newest verified older translation; never promote it to current."""
 for folder in sorted(manager.STORE.iterdir(),reverse=True):
  if not folder.is_dir() or folder.name>=current['snapshot']:continue
  try:
   source=json.loads((folder/'source.json').read_text())
   path=folder/(code+'.json');package=json.loads(path.read_text())
   if source['snapshot']!=folder.name or package.get('snapshot')!=folder.name or package.get('locale')!=code:continue
   if package.get('status')!='translated' or not manager.is_current(source,package):continue
   if manager.sha(json.dumps(source['strings'],ensure_ascii=False,sort_keys=True))!=source['source_hash']:continue
   manager.validate(source,package['strings'],code)
   record=manager.materialize(source,source['strings']) # Also checks the original register hash.
   return source,package,record,path
  except (OSError,ValueError,KeyError,TypeError):continue
 return None


ROOT=Path(__file__).resolve().parents[1];SITE=ROOT/'site'
spec=importlib.util.spec_from_file_location('publication',ROOT/'tools/publish-site.py');pub=importlib.util.module_from_spec(spec);spec.loader.exec_module(pub)
source=json.loads((ROOT/'content/site-languages.json').read_text())
# The public app reads this generated compact catalog without an extra request.
data_path=SITE/'data.js';data_text=data_path.read_text()
app_languages=[{key:row[key] for key in ('code','native','html','dir')} for row in source['languages']]
data_text=re.sub(r'window.LANGUAGES = \[.*?\n\];','window.LANGUAGES = '+json.dumps(app_languages,ensure_ascii=False,indent=2)+';',data_text,count=1,flags=re.S)
data_path.write_text(data_text)
subprocess.run(['node',str(ROOT/'tools/check-motion-locales.cjs'),'--write'],cwd=ROOT,check=True)
export=json.loads(subprocess.check_output(['node',str(ROOT/'tools/export-briefing.cjs')],cwd=ROOT))
scene_count=len(export['scenes']);language_count=len(source['languages'])
# Only validated, source-matched packages become public pages.
mspec=importlib.util.spec_from_file_location('translation_manager',ROOT/'tools/translations/manage.py');manager=importlib.util.module_from_spec(mspec);mspec.loader.exec_module(manager)
translation_source,targets=manager.prepare();manifest=manager.manifest(translation_source,targets)
record=json.loads((ROOT/'data'/translation_source['register']).read_text())
topic_count=len(record['records']);esc=pub.esc
publications={}
for code,state in manifest['languages'].items():
 if state['status'] in ('source','translated'):
  publications[code]=(translation_source,json.loads((ROOT/state['file']).read_text()),record,False)
 elif code!='ja':
  archived=validated_archive(manager,translation_source,code)
  if archived:
   archived_source,package,archived_record,_=archived
   publications[code]=(archived_source,package,archived_record,True)
ready=[dict(targets[code],status='archive' if archived else manifest['languages'][code]['status'],snapshot=page_source['snapshot'],url='/database' if code=='ja' else '/database.'+code) for code,(page_source,package,page_record,archived) in publications.items()]
bcp=lambda code:targets[code]['html']
rtl={'ar','fa','iw','ur','ps','sd','ug','dv','ckb','bal','ks','fa-AF','pa-Arab','bm-Nkoo'}
outdir=SITE/'data/translations'/translation_source['snapshot'];outdir.mkdir(parents=True,exist_ok=True)
for code,(page_source,package,page_record,archived) in publications.items():
 values=package['strings'];t=lambda key:esc(values[key])
 page_outdir=SITE/'data/translations'/page_source['snapshot'];page_outdir.mkdir(parents=True,exist_ok=True)
 (page_outdir/(code+'.json')).write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
 if code=='ja':continue
 body=f'<header><p class="kicker">INFOSEC BRIEFING</p><h1>{t("ui.title")}</h1><p class="intro">{t("ui.intro")}</p><p>{t("ui.cutoff")}: <bdi>{esc(page_record["cutoff_jst"])}</bdi></p><p>{t("ui.counts")}</p><aside class="translation-notice">{t("ui.notice")}</aside><p><a href="/database" lang="ja">{t("ui.original")}</a> · <a href="/languages">{t("ui.languages")}</a> · <a href="/data/translations/{esc(page_source["snapshot"])}/{esc(code)}.json" download>{t("ui.data")}</a></p></header>'
 impact_locale=pub.impact_pages.locale_package(ROOT,pub.LATEST,code)
 impact_labels=impact_locale[1] if impact_locale else None
 if impact_labels:body=pub.impact_pages.tabs('database',code,{k:esc(v)for k,v in impact_labels.items()})+body
 elif code=='en':body=pub.impact_pages.tabs('database','en')+body
 if archived:
  notice=f'<aside class="translation-notice archive-notice" data-snapshot="{esc(page_source["snapshot"])}"><span lang="en">Archived translation · <bdi>{esc(page_record["cutoff_jst"])}</bdi>. Information may differ from the latest version. <a href="/database">Latest Japanese database →</a></span></aside>'
  body=body.replace('<header>','<header>'+notice,1)
 body=body.replace('</header>',pub.language_select(ready,code,values['ui.languages'])+'</header>',1)
 for kind in ('delta','scope-complement','reference-only'):
  rows=[r for r in page_record['records'] if r['kind']==kind];body+=f'<section><h2>{t("ui."+kind)} · {len(rows)}</h2>'
  for row in rows:
   prefix='records.'+row['id']+'.';sources=' / '.join(f'<a href="{esc(x["url"])}" dir="auto">{esc(x["name"])}</a>' for x in row['sources'])
   body+=f'<article id="{esc(row["id"])}"><p class="event-type">{t(prefix+"time")}</p><h3>{t(prefix+"title")}</h3><p>{t(prefix+"body")}</p><p class="action"><strong>{t("ui.actions")}: </strong>{t(prefix+"action")}</p>{pub.advisory_details.render(row,esc,code,impact_labels)}<p class="sources">{t("ui.sources")}: {sources}</p></article>'
  body+='</section>'
 body+='<section><ul>'+''.join('<li>'+t('caveats.'+str(i))+'</li>' for i in range(len(page_record.get('caveats',[]))))+'</ul>'
 body+=f'<p><a href="{pub.REPO}blob/main/data/{esc(page_source["register"])}">{t("ui.evidence")}</a></p></section>'
 # A translated page has no Japanese navigation or editorial footer inserted into its body.
 page=pub.shell(values['ui.title'],values['ui.intro'],body)
 page=page.replace('<html lang="ja">',f'<html lang="{esc(bcp(code))}" dir="{"rtl" if code in rtl else "ltr"}">',1)
 page=page.replace('本文へ',t('ui.title'),1)
 a=page.index('<nav class="global">');z=page.index('</nav>',a)+6
 page=page[:a]+f'<nav class="global"><a href="/">{t("ui.home")}</a><a href="/database">{t("ui.original")}</a></nav>'+page[z:]
 (SITE/('database.'+code+'.html')).write_text(page)
# Remove unavailable pages; verified dated archives remain separate from current translations.
valid_codes={r['code'] for r in ready}
for path in SITE.glob('database.*.html'):
 if path.name[len('database.'):-len('.html')] not in valid_codes:path.unlink()
for path in outdir.glob('*.json'):
 if manifest['languages'].get(path.stem,{}).get('status') not in ('source','translated') and path.name!='manifest.json':path.unlink()
public_manifest={k:manifest[k] for k in ('snapshot','source_hash','register_hash','target_count','ready_count','note')}
public_manifest['languages']=[dict(state['language'],status=state['status'],url=('/database' if code=='ja' else '/database.'+code) if state['status'] in ('source','translated') else None,archive=({'snapshot':publications[code][0]['snapshot'],'url':'/database.'+code} if code in publications and publications[code][3] else None)) for code,state in manifest['languages'].items()]
(outdir/'manifest.json').write_text(json.dumps(public_manifest,ensure_ascii=False,indent=2)+'\n')
body=f'<header><p class="kicker">LANGUAGES</p><h1>対応言語</h1><p class="intro">各ページのプルダウンから言語を選べます。</p></header>'
body+='<section><h2>モーション</h2>'+pub.language_select([dict(row,url='/?lang='+row['code']) for row in source['languages']],None,'言語')+f'<p>{language_count}言語。ウクライナ語・ポーランド語・スウェーデン語は全{scene_count}画面を翻訳しています。他の言語の一部の追補画面は英語表示の場合があります。</p></section>'
body+='<section><h2>Tailworm特集</h2>'+pub.language_select([dict(row,url='/tailworm?lang=ja' if row['code']=='ja' else '/tailworm.'+row['code']) for row in source['languages']],None,'言語')+'</section>'
body+='<section><h2>調査データ</h2>'+pub.language_select(ready,None,'言語')+f'<p>最新の日本語データベースは{topic_count}論点です。翻訳ページは各ページに記載された日時の保存版で、最新情報と異なる場合があります。<a href="/database">最新の日本語データベース</a>で確認してください。AI翻訳は母語話者による校閲を行っていません。対策は原文・公式案内と照合してください。</p></section>'
body+=f'<section><h2>モーションの文章版</h2><p><a href="/briefing">日本語</a> · <a href="/briefing.en">English</a> — 全{scene_count}画面の本文と出典。</p></section>'
(SITE/'languages.html').write_text(pub.shell('対応言語',f'モーションとTailworm特集の{language_count}言語をプルダウンで選択。調査データの翻訳と文章版。',body))
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
