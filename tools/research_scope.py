"""Presentation-only scope review, pinned to the immutable evidence register."""
import hashlib, html, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCOPES=('global','japan','regional','unresolved')
def labels(lang):return json.loads((ROOT/'content/research-scope-labels.json').read_text())[lang]
def decisions(register,path,audit=None):
 if audit is None:audit=json.loads((ROOT/'content/research-scope.json').read_text())
 if audit.get('snapshot')!=path.parent.name or audit.get('register_sha256')!=hashlib.sha256(path.read_bytes()).hexdigest():
  return {r['id']:{'scope':'unresolved','reason':{lang:labels(lang)['pending'] for lang in ('ja','en')},'sources':[]} for r in register['records']}
 rows={r['id']:r for r in register['records']};result=audit['records']
 if audit.get('version')!=1 or set(rows)!=set(result):raise ValueError('Scope audit must cover the exact register')
 for key,value in result.items():
  if value['scope'] not in SCOPES or any(not value['reason'].get(lang,'').strip() for lang in ('ja','en')):raise ValueError('Invalid scope decision: '+key)
  if not value['sources'] or not set(value['sources']) <= {s['url'] for s in rows[key]['sources']}:raise ValueError('Unsupported scope evidence: '+key)
 return result

def export(register,path,audit=None):
 if audit is None:audit=json.loads((ROOT/'content/research-scope.json').read_text())
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 matched=audit.get('snapshot')==path.parent.name and audit.get('register_sha256')==digest
 return {'version':1,'snapshot':path.parent.name,'register_sha256':digest,
         'status':'reviewed' if matched else 'pending','reviewed_at':audit['reviewed_at'] if matched else None,
         'source_register':str(path.relative_to(ROOT/'data')),'records':decisions(register,path,audit)}

def groups(register,path,audit=None):
 review=decisions(register,path,audit)
 return [(scope,[r for r in register['records'] if review[r['id']]['scope']==scope]) for scope in SCOPES]
def intro(register,path,lang):
 e=html.escape;l=labels(lang);audit=json.loads((ROOT/'content/research-scope.json').read_text());review=decisions(register,path,audit)
 verified=export(register,path,audit)['status']=='reviewed'
 date=audit['reviewed_at'] if verified else l['pending']
 nav=' · '.join(f'<a href="#scope-{s}">{e(l[s])} ({len(rows)})</a>' for s,rows in groups(register,path,audit))
 return f'<section aria-label="{e(l["title"])}"><h2>{e(l["title"])}</h2><p>{e(l["notice"])}</p><p>{e(l["review"])}: {e(date)}</p><nav aria-label="{e(l["title"])}">{nav}</nav><p><a href="/data/research-scope.json">{e(l["data"])}</a> · <a href="https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/research-scope-audit-2026-10-30{(".ja" if lang=="ja" else "")}.md">{e(l["method"])}</a></p></section>'
def reason(register,path,row,lang):
 return '<p class="sources">'+html.escape(decisions(register,path)[row['id']]['reason'][lang])+'</p>'
