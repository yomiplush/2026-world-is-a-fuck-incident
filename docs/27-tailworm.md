# Tailworm special report — Tailscale / headscale

Cutoff: **2026-10-25 23:18 JST / 14:18 UTC**. Retrieved afterwards; current page revisions and the vendor post's exact edit time cannot establish an immutable cutoff snapshot. [Japanese detailed report](27-tailworm.ja.md) / [Collection metadata](../data/2026-10-25-2318/collection-summary.json).

The [researcher](https://tailworm.com/) reports lab findings against **Tailscale 1.104.2 and headscale 0.29.5**, covering SSH forwarding privilege boundaries, experimental conn25 destinations, memory exhaustion and conditional Serve/Funnel issues. These are tested versions, not Tailworm fixes. Eleven report headings include configuration and threat-model observations; they are not eleven assigned CVEs. We did not run the exploit kits, and the reviewed sources do not establish real-world Tailworm exploitation.

In a [first-party response](https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/), Tailscale engineering leadership says it is investigating and fixing issues, mainly involving privileges and forwarding after an authorized SSH connection. It does not recommend universally disabling Tailscale SSH. Review SSH access and forwarding, restrict sensitive destinations, use check mode as an additional entry barrier, and enable updates. Check mode does not repair post-authorization privilege escalation.

Inventory enabled Tailscale SSH separately from ordinary OpenSSH carried over the tunnel. Reduce unnecessary source/destination access and forwarding; consider temporarily disabling the embedded SSH service on sensitive hosts after verifying another management path. Treat headscale forwarding and public registration exposure separately. Review experimental conn25 permissions and actual egress, privileged Unix-socket Serve targets, external interface binds and backend authorization. Network firewalls do not mediate local Unix-socket races.

If compromise is suspected, preserve evidence, isolate, revoke the device identity through the control plane and rotate exposed enrollment/application credentials. Reimaging alone does not revoke copied state. Monitor official advisories for confirmed affected ranges and fixes.

[Tailscale 1.104.2 / TS-2026-013](https://tailscale.com/security-bulletins) addresses the separate eMudhra certificate incident. It must not be labeled a Tailworm fix. Current confirmed Tailworm fixed versions, dedicated CVEs and vendor severity ratings remain unresolved in this review.
