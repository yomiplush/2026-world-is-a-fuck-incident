"""Source-hashed offline translations of reading-page text; no runtime service."""
import hashlib,html,json,re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlsplit,urlunsplit
ROOT=Path(__file__).resolve().parents[1]
STORE=ROOT/'data/article-translations'
def key(text):return hashlib.sha256(text.encode()).hexdigest()
def valid(original,translated):
 return isinstance(translated,str) and bool(translated.strip()) and (translated!=original or not re.search('[\u3040-\u30ff\u3400-\u9fff]',original)) and sorted(re.findall(r'\d+(?:\.\d+)*',original))==sorted(re.findall(r'\d+(?:\.\d+)*',translated)) and all(x in translated for x in re.findall(r'(?:CVE-\d{4}-\d+|GHSA-[a-z0-9-]+)',original))
class Text(HTMLParser):
 def __init__(self,raw):
  super().__init__(convert_charrefs=False);self.raw=raw;self.rows=[];self.block=[];self.lines=[0]
  for m in re.finditer('\n',raw):self.lines.append(m.end())
  self.feed(raw)
 def handle_comment(self,data):
  # Each locale's publisher regenerates its own verified dates after translation.
  data=data.strip()
  if data=='publication-dates:start':self.block.append('publication-dates')
  elif data=='publication-dates:end' and self.block and self.block[-1]=='publication-dates':self.block.pop()
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style','select','noscript'):self.block.append(tag)
 def handle_endtag(self,tag):
  if self.block and tag==self.block[-1]:self.block.pop()
 def handle_data(self,data):
  if self.block or not re.search('[\u3040-\u30ff\u3400-\u9fff]',data):return
  value=html.unescape(data).strip()
  if not value:return
  line,col=self.getpos();start=self.lines[line-1]+col
  self.rows.append((start,start+len(data),value,data))
def extract(raw):return {key(value):value for _,_,value,_ in Text(raw).rows}
def render(raw,values):
 rows=Text(raw).rows
 for _,_,original,_ in rows:
  if not valid(original,values.get(key(original))):raise ValueError('Missing or invalid translation: '+original[:100])
 for start,end,original,data in reversed(rows):
  left=data[:len(data)-len(data.lstrip())];right=data[len(data.rstrip()):]
  raw=raw[:start]+left+html.escape(values[key(original)],quote=False)+right+raw[end:]
 return raw

def sources():
 paths=list((ROOT/'site').glob('day-*.html'))+list((ROOT/'site').glob('update-*.html'))
 paths += [ROOT/'site'/p for p in ('impact.html','about.html','timeline.html','languages.html','404.html','privacypolicy/index.html')]
 return [p for p in paths if p.exists() and not p.name.endswith('.en.html')]

def prepare():
 STORE.mkdir(parents=True,exist_ok=True)
 memory_path=ROOT/'data/translations/memory/en.json';memory=json.loads(memory_path.read_text()) if memory_path.exists() else {}
 current=STORE/'en.json'
 if current.exists():memory.update(json.loads(current.read_text()).get('strings',{}))
 allstrings={};pages={}
 for p in sources():
  raw=re.sub(r'<!-- article-language:start -->.*?<!-- article-language:end -->','',p.read_text(),flags=re.S)
  strings=extract(raw);allstrings.update(strings);pages[p.relative_to(ROOT/'site').as_posix()]=list(strings)
 missing={k:v for k,v in allstrings.items() if not valid(v,memory.get(k))}
 output={'source_hash':key(json.dumps(allstrings,ensure_ascii=False,sort_keys=True)),'strings':allstrings,'pages':pages}
 (STORE/'source.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
 (STORE/'en.json').write_text(json.dumps({'locale':'en','strings':{**(json.loads(current.read_text()).get('strings',{}) if current.exists() else {}),**{k:memory[k] for k in allstrings if valid(allstrings[k],memory.get(k))}},'note':'AI translation; not reviewed by a native speaker.'},ensure_ascii=False,indent=2)+'\n')
 # Disjoint missing string sets; globally shared text is translated only once.
 groups=[{}, {}, {}]
 for n,(k,v) in enumerate(sorted(missing.items(),key=lambda x:len(x[1]),reverse=True)):
  i=min(range(3),key=lambda i:sum(len(v)for v in groups[i].values()));groups[i][k]=v
 for i,g in enumerate(groups):(STORE/f'input-{i}.json').write_text(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
 print('Reading-page source strings',len(allstrings),'missing',len(missing),'groups',[len(g)for g in groups])

if __name__=='__main__':prepare()

def publish(pub):
 """Create complete English companions, then add same-article native selectors."""
 store=STORE/'en.json'
 memory=json.loads(store.read_text()).get('strings',{}) if store.exists() else {}
 for part in sorted(STORE.glob('output-*.json')):
  memory.update(json.loads(part.read_text()))
 source=json.loads((STORE/'source.json').read_text())
 for k,v in source['strings'].items():
  if k in memory and not valid(v,memory[k]):raise ValueError('Invalid article translation: '+v[:90])
 english={'locale':'en','source_hash':source['source_hash'],'strings':memory,'note':'AI translation; not reviewed by a native speaker.'}
 store.write_text(json.dumps(english,ensure_ascii=False,indent=2)+'\n')
 site=ROOT/'site';ready={}
 def stripped(raw):return re.sub(r'<!-- article-(?:language|alternates):start -->.*?<!-- article-(?:language|alternates):end -->','',raw,flags=re.S)
 for path in sources():
  raw=stripped(path.read_text());path.write_text(raw);strings=extract(raw)
  if not all(valid(v,memory.get(k)) for k,v in strings.items()):continue
  target=path.with_name(path.stem+'.en.html')
  text=render(raw,memory).replace('<html lang="ja">','<html lang="en">',1)
  # English title/body are authoritative; rebuild identity metadata for the companion.
  intro=re.search(r'<p class="intro">(.*?)</p>',text,re.S)
  description=html.unescape(re.sub('<[^>]+>','',intro[1])) if intro else 'Security incident research, primary sources, impact and response.'
  text=re.sub(r'(<meta name="description" content=")[^"]*(")',lambda m:m[1]+html.escape(description[:240],quote=True)+m[2],text,count=1)
  labels={'サイト内':'Site navigation','調査の表示切り替え':'Research views','確認状況から移動':'Evidence status','読む資料':'Reading materials'}
  for ja,en in labels.items():text=text.replace('aria-label="'+ja+'"','aria-label="'+en+'"')
  text=pub.metadata(target,text)
  if target.name=='404.en.html':text=text.replace('content="index,follow,max-image-preview:large"','content="noindex,follow"')
  target.write_text(text)
  ready[path]=target
 # Current complete translations only; remove outdated generated English articles.
 for relative in source['pages']:
  path=site/relative;target=path.with_name(path.stem+'.en.html')
  if path not in ready:target.unlink(missing_ok=True)
 if (site/'briefing.en.html').exists():ready[site/'briefing.html']=site/'briefing.en.html'
 routes={pub.clean_url('/'+a.relative_to(site).as_posix()):pub.clean_url('/'+b.relative_to(site).as_posix())for a,b in ready.items()}
 routes.update({'/database':'/database.en','/tailworm':'/tailworm.en'})
 if getattr(pub,'impact_en',False):routes['/impact']='/impact.en'
 for original,translated in ready.items():
  choices=[{'url':pub.clean_url('/'+original.relative_to(site).as_posix()),'code':'ja','native':'日本語','html':'ja'},
           {'url':pub.clean_url('/'+translated.relative_to(site).as_posix()),'code':'en','native':'English','html':'en'}]
  for path,code in [(original,'ja'),(translated,'en')]:
   text=stripped(path.read_text())
   if code=='en':
    text=render(text,memory)
    def localized_link(match):
     href=html.unescape(match[2]);parts=urlsplit(urljoin(pub.BASE+original.relative_to(site).as_posix(),href))
     if parts.netloc!=urlsplit(pub.BASE).netloc:return match[0]
     route=pub.clean_url(parts.path)
     if route=='/' and parts.query=='lang=ja':
      return 'href='+match[1]+html.escape(urlunsplit(('', '', '/', 'lang=en', parts.fragment)),quote=True)+match[1]
     if route not in routes:return match[0]
     return 'href='+match[1]+html.escape(urlunsplit(('', '',routes[route],parts.query,parts.fragment)),quote=True)+match[1]
    text=re.sub(r'<a\b[^>]*>',lambda anchor:re.sub(r'\bhref=(["\'])(.*?)\1',localized_link,anchor[0]),text)
   select=pub.language_select(choices,code,'言語 / Language')
   if code=='en':select+='<p class="translation-notice">AI translation. Check versions, conditions and actions against the Japanese original and primary sources.</p>'
   marker='<!-- article-language:start -->'+select+'<!-- article-language:end -->'
   if '<header>' in text:text=text.replace('<header>','<header>'+marker,1)
   else:text=re.sub(r'(<main\b[^>]*>)',lambda m:m[1]+marker,text,count=1)
   alternates=''.join(f'<link rel="alternate" hreflang="{x["code"]}" href="{pub.BASE.rstrip("/")+x["url"]}">' for x in choices)
   # Separate marker prevents accumulation across repeated builds.
   text=re.sub(r'<!-- article-alternates:start -->.*?<!-- article-alternates:end -->','',text,flags=re.S)
   text=re.sub(r'<link\b[^>]*\bhreflang=["\'][^>]*>','',text)
   alternates+=f'<link rel="alternate" hreflang="x-default" href="{pub.BASE.rstrip("/")+choices[0]["url"]}">'
   text=text.replace('</head>','<!-- article-alternates:start -->'+alternates+'<!-- article-alternates:end --></head>')
   if '/language-select.js' not in text:text=text.replace('</head>','<script src="/language-select.js" defer></script></head>')
   path.write_text(text)
 print('Complete reading-page language pairs:',len(ready))
 return ready
