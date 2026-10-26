// Consolidate legacy hosts without changing paths, queries or asset responses.
// Fragments are preserved by browsers because Location introduces no fragment.
const legacyHosts = new Set([
  'infosec-briefing.net',
  'infosec-briefing.yomiplush.dev',
  'www.infosec-briefing.yomiplush.dev',
  '2026-incident-briefing.pages.dev'
]);
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (legacyHosts.has(url.hostname) || (url.hostname === 'www.infosec-briefing.net' && url.protocol === 'http:')) {
      url.protocol = 'https:';
      url.hostname = 'www.infosec-briefing.net';
      url.port = '';
      return new Response(null, { status: 301, headers: {
        Location: url.href, 'Cache-Control': 'public, max-age=3600'
      }});
    }
    return env.ASSETS.fetch(request);
  }
};
