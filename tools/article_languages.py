"""Source-hashed offline translations of reading-page text; no runtime service."""
import hashlib,html,json,re,subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlsplit,urlunsplit
ROOT=Path(__file__).resolve().parents[1]
STORE=ROOT/'data/article-translations'
def key(text):return hashlib.sha256(text.encode()).hexdigest()
def valid(original,translated,locale=None):
 return isinstance(translated,str) and bool(translated.strip()) and (translated!=original or not re.search('[\u3040-\u30ff\u3400-\u9fff]',original) or (locale=='zh' and len(original)<12 and not re.search('[\u3040-\u30ff]',original))) and sorted(re.findall(r'\d+(?:\.\d+)*',original))==sorted(re.findall(r'\d+(?:\.\d+)*',translated)) and all(x in translated for x in re.findall(r'(?:CVE-\d{4}-\d+|GHSA-[a-z0-9-]+)',original))
class Text(HTMLParser):
 def __init__(self,raw):
  super().__init__(convert_charrefs=False);self.raw=raw;self.rows=[];self.block=[];self.lines=[0]
  for m in re.finditer('\n',raw):self.lines.append(m.end())
  self.feed(raw)
 def handle_starttag(self,tag,attrs):
  if not self.block:
   line,col=self.getpos();offset=self.lines[line-1]+col
   attributes=dict(attrs)
   for m in re.finditer(r'([\w:-]+)\s*=\s*([\"\'])(.*?)\2',self.get_starttag_text(),re.S):
    name,value=m[1],html.unescape(m[3])
    if name in ('aria-label','alt','title','placeholder') or (tag=='meta' and name=='content' and attributes.get('name')=='description'):
     if re.search('[\u3040-\u30ff\u3400-\u9fff]',value):
      self.rows.append((offset+m.start(3),offset+m.end(3),value,m[3]))
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
def render(raw,values,locale=None):
 rows=Text(raw).rows
 for _,_,original,_ in rows:
  if not valid(original,values.get(key(original)),locale):raise ValueError('Missing or invalid translation: '+original[:100])
 for start,end,original,data in reversed(rows):
  left=data[:len(data)-len(data.lstrip())];right=data[len(data.rstrip()):]
  raw=raw[:start]+left+html.escape(values[key(original)],quote=True)+right+raw[end:]
 return raw

def sources():
 paths=list((ROOT/'site').glob('day-*.html'))+list((ROOT/'site').glob('update-*.html'))
 paths += [ROOT/'site'/p for p in ('briefing.html','about.html','timeline.html','languages.html','404.html','privacypolicy/index.html')]
 return [p for p in paths if p.exists() and not re.search(r'\.[a-z]{2}\.html$',p.name)]

def prepare():
 STORE.mkdir(parents=True,exist_ok=True)
 memory_path=ROOT/'data/translations/memory/en.json';memory=json.loads(memory_path.read_text()) if memory_path.exists() else {}
 current=STORE/'en.json'
 previous=json.loads(current.read_text()) if current.exists() else {}
 if current.exists():memory.update(previous.get('strings',{}))
 allstrings={};pages={}
 for p in sources():
  raw=stripped(p.read_text())
  strings=extract(raw);allstrings.update(strings);pages[p.relative_to(ROOT/'site').as_posix()]=list(strings)
 allstrings.update(supplemental_strings())
 missing={k:v for k,v in allstrings.items() if not valid(v,memory.get(k))}
 output={'source_hash':key(json.dumps(allstrings,ensure_ascii=False,sort_keys=True)),'strings':allstrings,'pages':pages}
 (STORE/'source.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
 (STORE/'en.json').write_text(json.dumps({**previous,'locale':'en','strings':{k:memory[k] for k in allstrings if valid(allstrings[k],memory.get(k))},'note':'AI translation; not reviewed by a native speaker.'},ensure_ascii=False,indent=2)+'\n')
 # Disjoint missing string sets; globally shared text is translated only once.
 groups=[{}, {}, {}]
 for n,(k,v) in enumerate(sorted(missing.items(),key=lambda x:len(x[1]),reverse=True)):
  i=min(range(3),key=lambda i:sum(len(v)for v in groups[i].values()));groups[i][k]=v
 for i,g in enumerate(groups):(STORE/f'input-{i}.json').write_text(json.dumps(g,ensure_ascii=False,indent=2)+'\n')
 print('Reading-page source strings',len(allstrings),'missing',len(missing),'groups',[len(g)for g in groups])


NOTICE='機械翻訳です。母語話者による校閲は行われていません。版番号、条件と対策は日本語原文・一次資料と照合してください。'
def motion_source():
 script='const fs=require("fs"),vm=require("vm");let scope={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[1],"utf8"),scope);let c=scope.window.CONTENT;console.log(JSON.stringify({ui:c.ui.ja,scenes:Object.fromEntries(c.scenes.map(s=>[s.id,{...s.ja,...(s.metric?{metric:s.metric.label.ja}:{})}]))}));'
 return json.loads(subprocess.check_output(['node','-e',script,str(ROOT/'site/data.js')],text=True))
def supplemental_strings():
 strings={key(NOTICE):NOTICE}
 motion=motion_source()
 def walk(obj):
  if isinstance(obj,dict):
   for value in obj.values():walk(value)
  elif isinstance(obj,list):
   for value in obj:walk(value)
  elif isinstance(obj,str):strings.update(extract('<p>'+obj+'</p>'))
 walk(motion)
 for value in json.loads((ROOT/'content/privacy-copy.json').read_text()).values():strings[key(value)]=value
 for p in (ROOT/'data/translations').glob('*/source.json'):
  for value in json.loads(p.read_text())['strings'].values():strings[key(value)]=value
 return strings

def stripped(raw):
 return re.sub(r'<!-- (?:article-(?:language|alternates)|publication):start -->.*?<!-- (?:article-(?:language|alternates)|publication):end -->','',raw,flags=re.S)

def publish(pub):
 """Publish complete, validated same-article companions for the site catalog."""
 catalog=json.loads((ROOT/'content/site-languages.json').read_text())['languages']
 site=ROOT/'site';originals=sources();ready={};memories={}
 for row in catalog:
  code=row['code']
  if code=='ja':continue
  store=STORE/(code+'.json');memory=json.loads(store.read_text()).get('strings',{}) if store.exists() else {}
  if code=='en':
   for part in sorted(STORE.glob('output-*.json')):memory.update(json.loads(part.read_text()))
  memories[code]=memory
 for path in originals:
  raw=stripped(path.read_text());path.write_text(raw);strings=extract(raw)
  choices=[]
  for row in catalog:
   code=row['code'];target=path if code=='ja' else path.with_name(path.stem+'.'+code+'.html')
   if code!='ja' and not all(valid(v,memories[code].get(k),code) for k,v in strings.items()):
    target.unlink(missing_ok=True);continue
   choices.append(dict(row,url=pub.clean_url('/'+target.relative_to(site).as_posix()),path=target))
  ready[path]=choices
 for original,choices in ready.items():
  raw=stripped(original.read_text())
  for row in choices:
   code=row['code'];target=row['path'];text=raw if code=='ja' else render(raw,memories[code],code)
   text=re.sub(r'<html\b[^>]*>',f'<html lang="{row["html"]}" dir="{row["dir"]}">',text,count=1)
   if code!='ja':
    routes={pub.clean_url('/'+p.relative_to(site).as_posix()):next((c['url'] for c in cs if c['code']==code),None) for p,cs in ready.items()}
    routes.update({v:'/'+v[1:]+'.'+code for v in ('/database','/impact','/tailworm')})
    routes['/']='/?lang='+code
    def localized_link(match):
     href=html.unescape(match[2]);parts=urlsplit(urljoin(pub.BASE+original.relative_to(site).as_posix(),href))
     if parts.netloc!=urlsplit(pub.BASE).netloc:return match[0]
     route=pub.clean_url(parts.path)
     if not routes.get(route):return match[0]
     destination=urlsplit(routes[route]);query=destination.query or parts.query
     return 'href='+match[1]+html.escape(urlunsplit(('', '',destination.path,query,parts.fragment)),quote=True)+match[1]
    text=re.sub(r'<a\b[^>]*>',lambda anchor:re.sub(r'\bhref=(["\'])(.*?)\1',localized_link,anchor[0]),text)
   text=pub.metadata(target,text)
   # metadata may inject Japanese editorial chrome: remove it from companions.
   if code!='ja':text=re.sub(r'<!-- (?:editorial|language-nav):start -->.*?<!-- (?:editorial|language-nav):end -->','',text,flags=re.S)
   select=pub.language_select(choices,code,'Language')
   if code!='ja':select+='<p class="translation-notice">'+html.escape(memories[code][key(NOTICE)])+'</p>'
   marker='<!-- article-language:start -->'+select+'<!-- article-language:end -->'
   if '<header>' in text:text=text.replace('<header>','<header>'+marker,1)
   else:text=re.sub(r'(<main\b[^>]*>)',lambda m:m[1]+marker,text,count=1)
   text=re.sub(r'<link\b[^>]*\bhreflang=["\'][^>]*>','',text)
   alternates=''.join(f'<link rel="alternate" hreflang="{x["html"]}" href="{pub.BASE.rstrip("/")+x["url"]}">' for x in choices)
   alternates+=f'<link rel="alternate" hreflang="x-default" href="{pub.BASE.rstrip("/")+pub.clean_url("/"+original.relative_to(site).as_posix())}">'
   text=text.replace('</head>','<!-- article-alternates:start -->'+alternates+'<!-- article-alternates:end --></head>')
   if '/language-select.js' not in text:text=text.replace('</head>','<script src="/language-select.js" defer></script></head>')
   if original.name=='404.html':text=text.replace('content="index,follow,max-image-preview:large"','content="noindex,follow"')
   target.write_text(text)
 print('Reading pages:',len(ready),'complete language variants:',sum(len(cs) for cs in ready.values()))
 return ready

if __name__=='__main__':prepare()
