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
    for lang in ('ja','en'):
        en=lang=='en';suffix='.en' if en else ''
        title='Monthly research archive' if en else '月別の調査記録'
        intro='Browse dated security reviews by month. Historical reports remain available.' if en else '調査レポートを月ごとに探せます。同じ日の複数回の調査も、基準時刻別に残しています。'
        body=f'<header><p class="kicker">RESEARCH ARCHIVE</p><h1>{title}</h1><p class="intro">{intro}</p></header><section class="priority-grid">'
        for month,rows in grouped.items():
            body+=f'<article><h2><a href="/month-{month}{suffix}">{month}</a></h2><p>{len(rows)} {"dated records" if en else "件の調査・日別記録"}</p><p>{rows[-1]["cutoff_jst"][:10]} → {rows[0]["cutoff_jst"][:10]}</p></article>'
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
