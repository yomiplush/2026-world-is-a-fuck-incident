# Sanitized evidence captures

On October 30, 2026, embedded third-party Google API keys were replaced with `[REDACTED_GOOGLE_API_KEY]` in four saved HTML captures (including gzip files). The reported Imperva capture contains a `GOOGLE_GEOCODE_CLIENT_API_KEY` setting copied from the source website. This finding alone does not demonstrate compromise of Infosec Briefing or establish credential ownership, validity or restrictions. No keys were used or tested.

The [redaction log](../data/evidence-redactions.json) lists affected paths, original and sanitized stored-byte SHA-256 digests, and affected integrity manifests. Updated manifest hashes describe **sanitized captures**, not exact original responses; original retrieval headers remain historical metadata. Article content and research records remain available. Gzip copies were recompressed deterministically. This is a documented exception to preservation of original evidence bytes.

Run `python3 tools/intel/check-saved-secrets.py` before publishing collected evidence. It checks tracked files and decompressed gzip contents for Google API key patterns without printing values. This targeted check does not detect every type of secret and does not scan Git history.

Removing current copies does not revoke a key or remove previous Git commits, existing clones, forks or GitHub cached views. The key owner must assess restrictions and revoke/rotate exposed credentials as appropriate. Git history cleanup, coordinated force pushes, and GitHub secret-scanning alert resolution are separate actions; none is implied by sanitizing the current branch. The initial cleanup did not rewrite history or revoke credentials. The subsequent history rewrite is documented below; credential revocation remains unverified.

[日本語](security-evidence-redactions.ja.md)

## History rewrite, October 30, 2026

At the maintainer’s explicit request, `git-filter-repo` 2.47.0 was used on an isolated mirror to sanitize matching Google API key patterns in plain and gzip blobs across all available history. The rewrite processed 105 commits. Before cleanup, four historical blobs matched; afterwards, all 4,028 reachable historical blobs were checked with zero matches. The current main file tree was unchanged by this history operation. Rewritten branches are published with atomic, expected-SHA-protected force pushes, preserving branch names and avoiding overwriting concurrent remote updates.

There are eight public branches and no public tags. Twelve PR references are affected. GitHub’s read-only PR references and cached original commits cannot be purged with a branch force push; GitHub Support may need to handle those separately. No support request was sent. The first changed original commit is `a48cebdc2586fd76b701ac96d85cab0b358fd466`, retained here solely for a potential support request. Forks and other clones are outside this cleanup. Re-clone existing checkouts instead of merging old history back.

Historical captures were sanitized without retroactively recalculating every historical manifest: hashes recorded in old commits can describe pre-redaction bytes. Current main contains the explicit redaction log and corrected manifests from the initial cleanup. SHA-pinned links to rewritten commits may need manual updates. This procedure does not establish that the key has been revoked, that all GitHub caches have been purged, or that the secret-scanning alert is closed.

Reference: [GitHub’s sensitive-data removal guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
