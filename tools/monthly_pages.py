"""Static month navigation over immutable, dated research reviews."""
import html
import json
from collections import defaultdict

esc=lambda value:html.escape(str(value),quote=True)

def group_reviews(records):
    groups=defaultdict(list)
    for record in records:
        if record.get('report',{}).get('path') and record.get('cutoff_jst'):
            groups[record['cutoff_jst'][:7]].append(record)
    return {month:sorted(groups[month],key=lambda r:r['cutoff_jst'],reverse=True)
            for month in sorted(groups,reverse=True)}

def render_month(month,records,lang='ja'):
    en=lang=='en';suffix='.en' if en else ''
    title=month+(' · Research archive' if en else 'の調査記録')
    note=('Each review retains its original cutoff. Database entries and editorial topics are not counts of attacks. Repeated topics across reviews must not be added together.' if en else
          '各レポートは当時の基準時刻を保持しています。DB登録や編集上の論点は攻撃件数ではなく、複数レポートの重複を合算できません。')
    body=f'<header><p class="kicker">MONTHLY ARCHIVE · {esc(month)}</p><h1>{esc(title)}</h1><p class="intro">{esc(note)}</p><p><a href="/months{suffix}">{"All months" if en else "月別一覧へ"} →</a></p></header><section>'
    for record in records:
        report=record['report'];route='/'+report['path'].removesuffix('.html')+suffix
        stamp=record['cutoff_jst'][:16].replace('T',' ')+' JST'
        # Do not manufacture a translation for historical titles.
        label=(report.get('title_en') or stamp+' · Security review') if en else report.get('title',stamp)
        body+=f'<article><p class="event-type">{esc(stamp)}</p><h2><a href="{esc(route)}">{esc(label)}</a></h2>'
        if not en and report.get('intro'):body+=f'<p>{esc(report["intro"])}</p>'
        body+=f'<p><a href="{esc(route)}">{"Read report" if en else "このレポートを読む"} →</a></p></article>'
    return body+'</section>'

def build(pub):
    records=[]
    for path in (pub.ROOT/'data').glob('*/incident-register.json'):
        if not path.parent.name.endswith('-vendors'):
            record=json.loads(path.read_text())
            translated=pub.ROOT/'data/translations'/path.parent.name/'en.json'
            if record.get('report') and translated.exists():
                package=json.loads(translated.read_text())
                if package.get('register_hash')==__import__('hashlib').sha256(path.read_bytes()).hexdigest():
                    record['report']['title_en']=package.get('database',{}).get('report',{}).get('title','')
            records.append(record)
    for path in sorted(pub.SITE.glob('day-*.html')):
        if path.name.endswith('.en.html'):continue
        day=path.stem.removeprefix('day-')
        date=day[:4]+'-'+day[4:6]+'-'+day[6:8]
        records.append({'cutoff_jst':date,'report':{'path':path.name,'title':date+'の日別記録','title_en':date+' · Daily chronology'}})
    # These early generators predate report metadata in incident-register.json.
    legacy={'update-20261025.html':'2026-10-25T16:34:00+09:00',
            'update-20261025-2318.html':'2026-10-25T23:18:00+09:00',
            'update-20261026.html':'2026-10-26T10:27:00+09:00',
            'update-20261026-1301.html':'2026-10-26T13:01:00+09:00'}
    known={r['report']['path'] for r in records if r.get('report')}
    for filename,cutoff in legacy.items():
        if filename not in known and (pub.SITE/filename).exists():
            stamp=cutoff[:16].replace('T',' ')+' JST'
            records.append({'cutoff_jst':cutoff,'report':{'path':filename,'title':stamp+'の調査記録','title_en':stamp+' · Security review'}})
    grouped=group_reviews(records)
    tree_style='''<style>
.ymd-tree{display:grid;gap:14px;margin-top:24px}
.ymd-year,.ymd-month,.ymd-day{border:1px solid #29414e;border-radius:8px;background:rgba(16,26,36,.72);overflow:hidden;transition:border-color .22s ease}
.ymd-year[open],.ymd-month[open],.ymd-day[open]{border-color:rgba(255,181,69,.55)}
.ymd-tree summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;font-weight:600;user-select:none;transition:background .18s ease}
.ymd-tree summary::-webkit-details-marker{display:none}
.ymd-tree summary:hover{background:rgba(88,224,255,.08)}
.ymd-badge{font:500 12px/1.2 ui-monospace,monospace;color:#84dce8;border:1px solid rgba(88,224,255,.35);border-radius:999px;padding:3px 9px}
.ymd-body{padding:0 16px 14px;display:grid;gap:10px;animation:ymdReveal .26s cubic-bezier(.22,1,.36,1)}
.ymd-day-list{display:grid;gap:8px;padding-top:4px}
.ymd-item{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;border:1px solid #243844;border-radius:6px;text-decoration:none;color:#e4ebf2;background:rgba(7,12,18,.65);transition:border-color .18s,transform .18s}
.ymd-item:hover{border-color:#ffb545;transform:translateX(3px)}
.ymd-item small{color:#ffbd69;font-family:ui-monospace,monospace;white-space:nowrap}
@keyframes ymdReveal{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:600px){.ymd-tree summary{padding:12px 14px;min-height:48px;font-size:15px}.ymd-body{padding:0 10px 12px}.ymd-item{flex-direction:column;align-items:flex-start;gap:4px;padding:12px;min-height:48px}.ymd-badge{font-size:11px;padding:3px 7px}}
@media(min-width:768px) and (orientation:portrait){.ymd-tree{max-width:780px;margin-inline:auto}.ymd-tree summary{padding:16px 20px;min-height:52px}}
@media(prefers-reduced-motion:reduce){.ymd-body,.ymd-item,.ymd-year,.ymd-month,.ymd-day{animation:none;transition:none}}
</style>'''
    for lang in ('ja','en'):
        en=lang=='en';suffix='.en' if en else ''
        title='Monthly research archive' if en else '年・月・日別の調査記録'
        intro='Browse dated security reviews hierarchically by Year > Month > Day. Historical reports remain available.' if en else '年 ＞ 月 ＞ 日の階層アコーディオンで、大量の調査レポートを疲れずに探せます。同じ日の複数回の調査も基準時刻別に残しています。'
        by_year=defaultdict(lambda:defaultdict(lambda:defaultdict(list)))
        for month,rows in grouped.items():
            year=month[:4]
            for r in rows:
                day=r['cutoff_jst'][:10]
                by_year[year][month][day].append(r)
        body=tree_style+f'<header><p class="kicker">RESEARCH ARCHIVE · YEAR › MONTH › DAY</p><h1>{title}</h1><p class="intro">{intro}</p></header><section class="ymd-tree" aria-label="{"Year Month Day archive" if en else "年・月・日別アーカイブ"}">'
        for yi,year in enumerate(sorted(by_year,reverse=True)):
            y_total=sum(len(drows) for m in by_year[year].values() for drows in m.values())
            body+=f'<details class="ymd-year"{" open" if yi==0 else ""}><summary><span>{esc(year + ("" if en else "年"))}</span><span class="ymd-badge">{y_total} {"records" if en else "件"}</span></summary><div class="ymd-body">'
            for mi,month in enumerate(sorted(by_year[year],reverse=True)):
                m_total=sum(len(drows) for drows in by_year[year][month].values())
                m_label=month if en else f'{int(month[5:7])}月（{month}）'
                body+=f'<details class="ymd-month"{" open" if yi==0 and mi==0 else ""}><summary><span>{esc(m_label)}</span><span class="ymd-badge">{m_total} {"records" if en else "件"} · <a href="/month-{month}{suffix}" onclick="event.stopPropagation()">{"Open month" if en else "月ページ"} →</a></span></summary><div class="ymd-body">'
                for di,day in enumerate(sorted(by_year[year][month],reverse=True)):
                    drows=by_year[year][month][day]
                    body+=f'<details class="ymd-day"{" open" if yi==0 and mi==0 and di==0 else ""}><summary><span>{esc(day)}</span><span class="ymd-badge">{len(drows)} {"items" if en else "件"}</span></summary><div class="ymd-body"><div class="ymd-day-list">'
                    for r in drows:
                        report=r['report'];route='/'+report['path'].removesuffix('.html')+suffix
                        stamp=r['cutoff_jst'][11:16]+' JST' if len(r['cutoff_jst'])>=16 else day
                        label=(report.get('title_en') or stamp+' · Security review') if en else report.get('title',stamp)
                        body+=f'<a class="ymd-item" href="{esc(route)}"><span>{esc(label)}</span><small>{esc(stamp)}</small></a>'
                    body+='</div></div></details>'
                body+='</div></details>'
            body+='</div></details>'
        body+='</section>'
        targets=[('months'+suffix+'.html',title,intro,body)]
        for month,rows in grouped.items():targets.append(('month-'+month+suffix+'.html',month+' · '+title,intro,render_month(month,rows,lang)))
        for filename,title,description,body in targets:
            other=filename.replace('.en.html','.html') if en else filename.replace('.html','.en.html')
            switch=f'<p><a href="/{other.removesuffix(".html")}" lang="{"ja" if en else "en"}">{"日本語" if en else "English"}</a></p>'
            page=pub.shell(title,description,body.replace('</header>',switch+'</header>',1))
            if en:
                import re
                nav=f'<nav class="global"><a href="/en/">Home</a><a href="/database.en">Research database</a><a href="/months.en">Monthly archive</a><a href="{pub.clean_url(pub.LATEST["site_report"])}.en">Latest report</a></nav>'
                page=page.replace('<html lang="ja">','<html lang="en">',1).replace('本文へ','Skip to content',1)
                page=re.sub(r'<nav class="global">.*?</nav>',nav,page,count=1,flags=re.S)
            (pub.SITE/filename).write_text(page)

def navigation(text,en=False):
    import re
    text=re.sub(r'<!-- months:start -->.*?<!-- months:end -->','',text,flags=re.S)
    suffix='.en' if en else ''
    link=f'<!-- months:start --><a href="/months{suffix}">{"Monthly archive" if en else "月別"}</a><!-- months:end -->'
    return text.replace('</nav>',link+'</nav>',1)
