#!/usr/bin/env python3
"""Snapshot language labels from Google's public consumer website picker.
No translation API, authentication or runtime website dependency.
"""
import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
URLS = {hl: 'https://translate.google.com/?sl=auto&tl=en&op=websites&hl=' + hl
        for hl in ('en', 'ja')}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
        'meta', 'param', 'source', 'track', 'wbr'}


class Picker(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.option = None
        self.label_depth = None
        self.labels = {}
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.depth += 1
        attrs = dict(attrs)
        if attrs.get('role') == 'option' and attrs.get('data-language-code'):
            self.option = {'code': attrs['data-language-code'],
                           'depth': self.depth, 'label': ''}
        if self.option and 'Llmcnf' in attrs.get('class', '').split():
            self.label_depth = self.depth

    def handle_startendtag(self, tag, attrs):
        if tag not in VOID:
            self.handle_starttag(tag, attrs)
            self.handle_endtag(tag)

    def handle_data(self, text):
        if self.option and self.label_depth is not None:
            self.option['label'] += text

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.label_depth == self.depth:
            self.label_depth = None
        if self.option and self.option['depth'] == self.depth:
            code, label = self.option['code'], self.option['label'].strip()
            if not label:
                raise ValueError('Language picker label missing: ' + code)
            if code in self.labels and self.labels[code] != label:
                raise ValueError('Conflicting picker labels: ' + code)
            self.labels[code] = label
            self.option = None
        self.depth -= 1


def snapshot(html_dir=None):
    catalogs, sources = {}, []
    for hl, url in URLS.items():
        if html_dir:
            source_file = html_dir / ('google-translate-ui-' + hl + '.html')
            raw = source_file.read_bytes()
            retrieved = datetime.fromtimestamp(source_file.stat().st_mtime, timezone.utc)
        else:
            with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as response:
                raw = response.read()
            retrieved = datetime.now(timezone.utc)
        labels = Picker(raw.decode('utf-8')).labels
        if labels.pop('auto', None) is None or len(labels) < 200:
            raise ValueError('Incomplete/changed public picker: ' + hl)
        if not all(re.fullmatch(r'[A-Za-z]{2,3}(?:-[A-Za-z0-9]+)*', code) for code in labels):
            raise ValueError('Unexpected language code; review public picker')
        catalogs[hl] = labels
        sources.append({'language': hl, 'url': url,
                        'retrievedAt': retrieved.isoformat(timespec='seconds'),
                        'sha256': hashlib.sha256(raw).hexdigest()})
    if catalogs['en'].keys() != catalogs['ja'].keys():
        raise ValueError('English and Japanese picker catalogs differ')
    rows = [{'code': code, 'en': name, 'ja': catalogs['ja'][code]}
            for code, name in sorted(catalogs['en'].items(), key=lambda row: row[1].casefold())]
    return {'sourceURL': URLS['en'], 'sources': sources,
            'retrievedAt': max(source['retrievedAt'] for source in sources),
            'targetCount': len(rows), 'languages': rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--html-dir', type=Path, help='Parse previously fetched public HTML instead of fetching')
    parser.add_argument('--output', type=Path, default=ROOT / 'content/google-translate-languages.json')
    args = parser.parse_args()
    data = snapshot(args.html_dir)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print('Saved', data['targetCount'], 'consumer target languages to', args.output)


if __name__ == '__main__':
    main()
