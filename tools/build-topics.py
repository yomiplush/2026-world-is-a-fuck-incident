#!/usr/bin/env python3
"""Build focused, bilingual reading pages from the source-matched register."""
import html
import json
from pathlib import Path
import advisory_details

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
esc = lambda value: html.escape(str(value), quote=True)


def build_collection(config):
    snapshot = config['snapshot']
    for language in ('ja', 'en'):
        package = json.loads((ROOT / 'data/translations' / snapshot / (language + '.json')).read_text())
        source = json.loads((ROOT / 'data/translations' / snapshot / 'source.json').read_text())
        if package['source_hash'] != source['source_hash'] or package['register_hash'] != source['register_hash']:
            raise ValueError('Topic translation does not match its source')
        record = package['database']
        english = language == 'en'
        suffix = '.en' if english else ''
        report = '/' + record['report']['path'].removesuffix('.html') + suffix
        topics = {row['id']: row for row in record['records']}
        directory = SITE / 'topics'
        directory.mkdir(exist_ok=True)
        for topic in config['ids']:
            row = topics[topic]
            links = ' / '.join(f'<a href="{esc(s["url"])}">{esc(s["name"])}</a>' for s in row['sources'])
            related = ' · '.join(f'<a href="/topics/{esc(other)}{suffix}">{esc(topics[other]["title"])}</a>' for other in config['ids'] if other != topic)
            other = '' if english else '.en'
            note = ('A first fixed version is listed only when the advisory provides one. Advisory counts are not incident counts.' if english else '修正版は勧告の記載がある場合だけ示します。勧告数は被害件数ではありません。')
            motion = config.get('motion_scenes', {}).get(topic, config.get('motion_start', 75))
            page = f'''<!doctype html><html lang="{language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(row['title'])} | Infosec Briefing</title><meta name="description" content="{esc(row['body'])}"><link rel="stylesheet" href="/update.css"><link rel="stylesheet" href="/daily.css"><link rel="stylesheet" href="/privacy.css"><script defer src="/privacy.js"></script></head><body><main id="content"><nav class="global"><a href="{report}">{'Dated report' if english else 'この日のレポート'}</a><a href="/database{suffix}">{'Research database' if english else '調査データ'}</a><a href="/?lang={language}#{motion}">Motion</a><a href="/topics/{topic}{other}">{'日本語' if english else 'English'}</a></nav><header><p class="kicker">PRIMARY-SOURCE REVIEW · {esc(record['cutoff_jst'])}</p><h1>{esc(row['title'])}</h1><p class="intro">{esc(row['body'])}</p></header><section><h2>{'What to check' if english else '確認すること'}</h2><p>{esc(row['action'])}</p><p>{note}</p>{advisory_details.render(row,esc,language)}</section><section><h2>{'Primary sources' if english else '一次資料'}</h2><p>{links}</p></section><section><h2>{'Related topics' if english else '関連する論点'}</h2><p>{related}</p></section></main></body></html>'''
            (directory / (topic + suffix + '.html')).write_text(page)
        if not english:
            report_path = SITE / record['report']['path']
            report_text = report_path.read_text()
            start, end = '<!-- topic-links:start -->', '<!-- topic-links:end -->'
            import re
            report_text = re.sub(re.escape(start) + '.*?' + re.escape(end), '', report_text, flags=re.S)
            topic_links = ' · '.join(f'<a href="/topics/{esc(topic)}">{esc(topics[topic]["title"])}</a>' for topic in config['ids'])
            block = start + '<section><h2>関連する論点</h2><p>' + topic_links + '</p></section>' + end
            report_path.write_text(report_text.replace('</header>', '</header>' + block, 1))
    return len(config['ids']) * 2


def main():
    config = json.loads((ROOT / 'content/topic-pages.json').read_text())
    count = sum(build_collection(collection) for collection in [config, *config.get('collections', [])])
    print(f'Built {count} focused reading pages (Japanese / English)')


if __name__ == '__main__':
    main()
