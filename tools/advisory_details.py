"""Escaped, optional per-advisory version details for reading pages."""
def render(row, esc):
    rows = row.get('advisories', [])
    if not rows:
        return ''
    text = '<details><summary>勧告別：対象バージョンと修正版（'+str(len(rows))+'件）</summary>'
    for advisory in rows:
        text += f'<h4><a href="{esc(advisory["url"])}">{esc(advisory["id"])}</a></h4><p lang="en">{esc(advisory["summary"])}</p><ul>'
        for item in advisory['packages']:
            package = item['package']
            patch = item.get('first_patched_version') or '修正版の記載なし'
            text += f'<li><code>{esc(package["name"])}</code> ({esc(package["ecosystem"])}): 対象 <code>{esc(item["vulnerable_version_range"])}</code> → 修正版 <code>{esc(patch)}</code></li>'
        text += '</ul>'
    return text+'</details>'
