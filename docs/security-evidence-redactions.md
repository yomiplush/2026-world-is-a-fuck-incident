# Sanitized evidence captures

On October 30, 2026, embedded third-party Google API keys were replaced with `[REDACTED_GOOGLE_API_KEY]` in four saved HTML captures (including gzip files). The reported Imperva capture contains a `GOOGLE_GEOCODE_CLIENT_API_KEY` setting copied from the source website. This finding alone does not demonstrate compromise of Infosec Briefing or establish credential ownership, validity or restrictions. No keys were used or tested.

The [redaction log](../data/evidence-redactions.json) lists affected paths, original and sanitized stored-byte SHA-256 digests, and affected integrity manifests. Updated manifest hashes describe **sanitized captures**, not exact original responses; original retrieval headers remain historical metadata. Article content and research records remain available. Gzip copies were recompressed deterministically. This is a documented exception to preservation of original evidence bytes.

Run `python3 tools/intel/check-saved-secrets.py` before publishing collected evidence. It checks tracked files and decompressed gzip contents for Google API key patterns without printing values. This targeted check does not detect every type of secret and does not scan Git history.

Removing current copies does not revoke a key or remove previous Git commits, existing clones, forks or GitHub cached views. The key owner must assess restrictions and revoke/rotate exposed credentials as appropriate. Git history cleanup, coordinated force pushes, and GitHub secret-scanning alert resolution are separate actions; none is implied by sanitizing the current branch. No history rewrite or credential revocation was performed.

[日本語](security-evidence-redactions.ja.md)
