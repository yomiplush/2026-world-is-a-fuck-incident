#!/usr/bin/env python3
"""Build complete, script-independent Tailworm language pages. No dependencies."""
import html
import json
from datetime import datetime
from urllib.parse import urlparse
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = json.loads((ROOT / 'content/site.json').read_text())['base_url']
LANGUAGES = [(row['code'],row['native'],row['html']) for row in json.loads((ROOT/'content/site-languages.json').read_text())['languages']]


def filename(code):
    return 'tailworm.html' if code == 'ja' else f'tailworm.{code}.html'


def canonical(code):
    # Freeze Japanese explicitly; the unqualified entrance follows the browser.
    return BASE + filename(code) + ('?lang=ja' if code == 'ja' else '')


class Markup(HTMLParser):
    """Keep translation markup and destinations identical to the Japanese source."""
    def __init__(self, text):
        super().__init__()
        self.tokens = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tokens.append(('start', tag, sorted(attrs)))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        self.tokens.append(('end', tag))


def main():
    template = (ROOT / 'tools/templates/tailworm.html.template').read_text()
    source = json.loads((ROOT / 'content/tailworm/ja.json').read_text())
    latest = json.loads((ROOT / 'data/latest.json').read_text())
    latest_label = datetime.fromisoformat(latest['cutoff_jst']).strftime('%m/%d %H:%M')
    for code, native, lang in LANGUAGES:
        copy = json.loads((ROOT / f'content/tailworm/{code}.json').read_text())
        for group in ('meta', 'body'):
            if copy[group].keys() != source[group].keys():
                raise ValueError(f'{code}: incomplete {group} translation')
        for key, value in copy['body'].items():
            if not value.strip() or Markup(value).tokens != Markup(source['body'][key]).tokens:
                raise ValueError(f'{code}/{key}: missing copy or changed markup/URL')
        values = {f'meta.{key}': html.escape(value, quote=True) for key, value in copy['meta'].items()}
        values.update({f'body.{key}': value for key, value in copy['body'].items()})
        values['body.t001'] = re.sub(r'\d{2}/\d{2} \d{2}:\d{2}', latest_label, values['body.t001'])
        values.update(locale=code, html_lang=lang, dir='rtl' if code == 'ar' else 'ltr',
                      latest_report=Path(urlparse(latest['site_report']).path).name,
                      canonical=canonical(code))
        values['language_options'] = ''.join(
            f'<option value="{c}"'+(' selected' if c == code else '')+f' lang="{l}">{n}</option>'
            for c, n, l in LANGUAGES)
        values['fallback_links'] = ''.join(
            f'<a href="./{filename(c)}?lang={c}" lang="{l}" hreflang="{l}"'+
            (' aria-current="page"' if c == code else '')+f'>{n}</a>' for c, n, l in LANGUAGES)
        values['alternates'] = ''.join(
            f'<link rel="alternate" hreflang="{l}" href="{canonical(c)}">'
            for c, _, l in LANGUAGES) + f'<link rel="alternate" hreflang="x-default" href="{BASE}tailworm.html">'
        result = re.sub(r'\{\{([\w.]+)\}\}', lambda m: values[m[1]], template)
        # The motion feature supports the configured locales. Detailed prose on
        # GitHub is available in Japanese and English; label it accurately.
        result = result.replace('./?lang=ja#41', f'./?lang={code}#41')
        if code != 'ja':
            result = result.replace('docs/27-tailworm.ja.md', 'docs/27-tailworm.md')
        else:
            result = result.replace('docs/27-tailworm.md" hreflang="en"',
                                    'docs/27-tailworm.ja.md" hreflang="ja"')
        (ROOT / 'site' / filename(code)).write_text(result.rstrip() + '\n')
    sitemap = ROOT / 'site/sitemap.xml'
    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    xhtml = 'http://www.w3.org/1999/xhtml'
    ET.register_namespace('', ns)
    ET.register_namespace('xhtml', xhtml)
    tree = ET.parse(sitemap)
    urls = tree.getroot()
    known = {BASE + filename(c) for c, _, _ in LANGUAGES} | {canonical(c) for c, _, _ in LANGUAGES}
    for url in list(urls):
        if url.findtext(f'{{{ns}}}loc') in known:
            urls.remove(url)
    for code, _, _ in LANGUAGES:
        url = ET.SubElement(urls, f'{{{ns}}}url')
        ET.SubElement(url, f'{{{ns}}}loc').text = canonical(code)
        ET.SubElement(url, f'{{{ns}}}lastmod').text = '2026-10-26'
        for c, _, lang in LANGUAGES:
            ET.SubElement(url, f'{{{xhtml}}}link', rel='alternate', hreflang=lang,
                          href=canonical(c))
    ET.indent(tree, space='  ')
    tree.write(sitemap, encoding='utf-8', xml_declaration=True)
    print(f'Built {len(LANGUAGES)} complete Tailworm language pages, with matching markup, source URLs and sitemap alternates')


if __name__ == '__main__':
    main()
