"""Escaped, optional per-advisory version details for reading pages."""
def render(row, esc, lang="ja", labels=None):
    rows = row.get('advisories', [])
    if not rows:
        return ''
    english=lang=='en'
    if labels:
        title=esc(labels['advisory_versions']);affected=esc(labels['affected']);fixed=esc(labels['fixed']);no_fix=esc(labels['no_fix'])
    else:
        title='Affected and fixed versions by advisory' if english else '勧告別：対象バージョンと修正版';affected='affected' if english else '対象';fixed='fixed' if english else '修正版';no_fix='No fixed version listed' if english else '修正版の記載なし'
    heading=title+'（'+str(len(rows))+'件）' if lang=='ja' else title+' ('+str(len(rows))+')'
    text = '<details><summary>'+heading+'</summary>'
    for advisory in rows:
        text += f'<h4><a href="{esc(advisory["url"])}">{esc(advisory["id"])}</a></h4><p lang="en">{esc(advisory["summary"])}</p><ul>'
        for item in advisory['packages']:
            package = item['package']
            patch = item.get('first_patched_version') or no_fix
            text += f'<li><code>{esc(package["name"])}</code> ({esc(package["ecosystem"])}): {affected} <code>{esc(item["vulnerable_version_range"])}</code> → {fixed} <code>{esc(patch)}</code></li>'
        text += '</ul>'
    return text+'</details>'
