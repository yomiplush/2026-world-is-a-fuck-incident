/* Scene data. Every fact here is checked against the repository's docs/
   (which in turn cite primary sources). Japanese copy, technical terms kept in English.
   visual.type selects a renderer in visuals.js. */
window.SCENES = [
  {
    id: "intro",
    kicker: "INCIDENT BRIEFING · 2026-10",
    stamp: "OCT 2026",
    title: "ひと月で、15件。",
    lede: "互いに無関係に見える事案が、同じ種類の弱点に集まった月。タップで時系列に進みます。",
    points: [
      "15件のうち <b>8件</b>が npm / pip / プラグイン / リリース資産 — コードではなく<em>配布</em>",
      "14件は<b>一次ソース</b>で確認済み。1件（ConnectWise）は未確認",
      "音が出ます。右上の <b>SOUND</b> で消せます"
    ],
    metric: { val: "15", label: "incidents · 1 month" },
    visual: { type: "radar" },
    cue: "alarm",
    sources: [
      { name: "Repository / 一次ソース一覧", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident", note: "docs/14 が15件を1件ずつ検証" }
    ]
  },
  {
    id: "php-silence",
    kicker: "PHP CORE · COORDINATED DISCLOSURE",
    stamp: "08.11",
    title: "70日間、静かだった。",
    lede: "発見から公開まで70日。危険だったのは、公開後の24時間ではなく、公開の直前。",
    points: [
      "08-01 Calif が複数の RCE 経路を発見 / 08-11 PHP へ報告",
      "10-20 詳細が漏えい、watchTowr が RCE を確認",
      "10-21 <b>07:43 UTC</b> 修正公開の前に攻撃試行を観測（Cloudflare）",
      "10-21 14:00 修正版 — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
    ],
    metric: { val: "70", label: "days from report to public" },
    visual: { type: "timeline", marks: ["08.01", "08.11", "10.20", "10.21"] },
    cue: "whoosh",
    sources: [
      { name: "docs/00 タイムライン", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/00-timeline.ja.md", note: "UTC/JST" },
      { name: "php.net リリース", url: "https://www.php.net/archive/2026.php", note: "8.5.12 ほか" }
    ]
  },
  {
    id: "zeabur",
    kicker: "ZEABUR · INFRASTRUCTURE",
    stamp: "10.14",
    title: "平文の管理者鍵が、9リージョンを開けた。",
    lede: "8月に続いて2回目。ローテーションは「今回使われた鍵」をカバーしていなかった。",
    points: [
      "10-14 01:36 内部 AWS キーで侵入 / 01:51 にシステム秘密",
      "12:39 から全サービスの環境変数へ拡大、<b>865</b> の DB サービスでコマンド実行",
      "原因は平文・無期限の管理者資格情報と、公開されていた管理画面",
      "利用者は全環境変数をローテート（8月に実施済みでも、もう一度）"
    ],
    metric: { val: "865", label: "database services touched" },
    visual: { type: "grid", cols: 9, rows: 5, hot: [3, 7, 11, 16, 22, 28, 31, 37, 41] },
    cue: "alarm",
    sources: [
      { name: "Zeabur 報告 (2026-10-19)", url: "https://zeabur.com/blogs/october-2026-security-incident", note: "confirmed / assessed を使い分けた一次報告" }
    ]
  },
  {
    id: "rankmath",
    kicker: "RANK MATH SEO PRO · PLUGIN CHANNEL",
    stamp: "10.15",
    title: "11時間だけ、公式配布物が汚染された。",
    lede: "プラグインの更新経路は、そのまま攻撃経路になる。CVSS は 9.8。",
    points: [
      "10-15 20:02 → 10-16 07:12 UTC に取得した <b>3.0.123</b>",
      "<b>CVE-2026-111862</b> / CVSS 9.8 / 修正は 3.0.124",
      "更新は対策にならない — 管理者アカウント・追加ファイル・定期タスクを探す",
      "Wordfence は緊急ファイアウォールルールを前倒しで配布"
    ],
    metric: { val: "9.8", label: "CVSS · CVE-2026-111862" },
    visual: { type: "grid", cols: 12, rows: 6, hot: [34], poison: true },
    cue: "glitch",
    sources: [
      { name: "Wordfence PSA", url: "https://www.wordfence.com/blog/2026/10/rank-math-seo-pro-3-0-123-malware/", note: "2026-10-17" }
    ]
  },
  {
    id: "teamupdraft",
    kicker: "TEAMUPDRAFT · CONNECTION KEYS",
    stamp: "10.17",
    title: "DBにあった鍵が、数千サイトの入口だった。",
    lede: "接続キーは「署名付きの正規コマンド」として使える。だから既存の修正では止まらない。",
    points: [
      "顧客DBが読まれた: 連絡先、ハッシュ化パスワード、2FA設定、<b>接続キー3種</b>",
      "UpdraftCentral / UpdraftVault / UpdraftClone のキーで悪性プラグインを投入",
      "署名が本物なので、CVE-2026-10795 適用済みでも受理された",
      "UpdraftPlus 1.26.13 / 2.26.13 が 10-18 22:00 BST 以前の接続を自動切断"
    ],
    metric: { val: "3", label: "key types abused" },
    visual: { type: "fanout", nodes: 14 },
    cue: "crack",
    sources: [
      { name: "TeamUpdraft 告知", url: "https://teamupdraft.com/blog/security-incident-october-2026/", note: "10-19 公開 / 10-21 更新" },
      { name: "Wordfence PSA", url: "https://www.wordfence.com/blog/2026/10/updraftcentral-connection-key-compromise/", note: "署名付きコマンドの分析" }
    ]
  },
  {
    id: "emudhra",
    kicker: "EMUDHRA · CERTIFICATE AUTHORITY",
    stamp: "10.17",
    title: "鍵は盗まれていない。弱すぎた。",
    lede: "P-384 の秘密鍵が、小さい整数だった。1本は文字通り「4」。ノートPCで1秒未満で復元できる。",
    points: [
      "中間CA <b>8本</b>（TLS 6＋コード署名 2）、2025年4月の鍵生成セレモニー",
      "10-17 18:05 UTC 報告 → 19:45 Chrome が SPKI ハッシュで遮断、22:59 に Firefox 全台",
      "CT は TLS のみ。コード署名の2本は「CTに無い」では晴れない",
      "10-21 Tailscale <b>TS-2026-013</b>: v1.104.2 で Go 1.27.3 の拒否リストを取り込み"
    ],
    metric: { val: "4", label: "one private key, literally" },
    visual: { type: "keys", count: 8, weakIndex: 3 },
    cue: "crack",
    sources: [
      { name: "Google (Chrome Root Program)", url: "https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/", note: "SPKI 遮断 / ルート削除" },
      { name: "Scott Helme", url: "https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/", note: "鍵の復元" },
      { name: "Tailscale TS-2026-013", url: "https://tailscale.com/security-bulletins", note: "2026-10-21" }
    ]
  },
  {
    id: "ovh",
    kicker: "OVHCLOUD CLI · RELEASE ASSETS",
    stamp: "10.19",
    title: "94分間、公式バイナリは別物だった。",
    lede: "ソースもビルドも無事。壊れたのは「リリース資産を差し替えられない」という前提。",
    points: [
      "10-19 14:47〜16:21（UTC+2）に資産が差し替え",
      "対象は <b>v0.11.0〜v0.15.0</b>、影響はその時間帯の取得のみ",
      "原因: リポジトリがリリースの不変性（immutability）を保証していなかった",
      "対策は設定ひとつ: 不変リリース＋署名検証"
    ],
    metric: { val: "94", label: "minutes of exposure" },
    visual: { type: "ladder", steps: ["v0.11", "v0.12", "v0.13", "v0.14", "v0.15"], hot: 2 },
    cue: "whoosh",
    sources: [
      { name: "GHSA-862f-55f5-vmvw", url: "https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw", note: "2026-10-20 公開" }
    ]
  },
  {
    id: "oracle",
    kicker: "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
    stamp: "10.20",
    title: "55件。最大は 7.5。厄介なのは版。",
    lede: "「影響を受ける版」と「修正版」は別の列。21.0.12.1 は影響版で、修正は 21.0.13。",
    points: [
      "55件 / 認証不要でリモート 49件 / 最大 CVSS 7.5 / KEV 0件",
      "影響: 8u503, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1, 26.0.2, 27",
      "修正（10-20）: <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
      "JDK 26 に修正は無い（26.0.3 は存在しない）→ 27 へ"
    ],
    metric: { val: "55", label: "CVEs · 49 remote, no auth" },
    visual: { type: "matrix", cols: 11, rows: 5, swap: true },
    cue: "confirm",
    sources: [
      { name: "Oracle CPU 2026-10", url: "https://www.oracle.com/security-alerts/cpuoct2026.html", note: "Java SE Risk Matrix" },
      { name: "IPA 注意喚起", url: "https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html", note: "2026-10-21" }
    ]
  },
  {
    id: "plex",
    kicker: "PLEX MEDIA SERVER · KEV",
    stamp: "10.20",
    title: "4.3 の SSRF が、コード実行への入口になる。",
    lede: "個々のスコアは平凡。CISA の KEV は、その4件が連鎖すると明記している。",
    points: [
      "KEV 追加 10-20 / 期限 <b>10-23</b>（96656 と 96654）",
      "連鎖: 任意の X-Plex-Token → SSRF → プラグイン呼び出し → 管理書き込み → 起動時に .so 実行",
      "96651 は KEV 外だが <b>PlexOnlineToken</b> を読む＝アカウント掌握",
      "修正 <b>1.43.3.10861</b>。NAS のパッケージは遅れる（ベンダも警告）"
    ],
    metric: { val: "4/5", label: "CVEs in KEV · due 10-23" },
    visual: { type: "chain", nodes: ["TOKEN", "SSRF", "PLUGIN", "ADMIN", "EXEC"], deadline: true },
    cue: "alarm",
    sources: [
      { name: "CISA CSAF VA-26-266-01", url: "https://github.com/cisagov/CSAF/blob/develop/csaf_files/IT/white/2026/va-26-266-01.json", note: "5件と修正版" },
      { name: "CISA KEV", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", note: "期限と連鎖の注記" }
    ]
  },
  {
    id: "php-race",
    kicker: "PHP · THE SIX-HOUR GAP",
    stamp: "10.21",
    title: "修正の6時間前に、試行は来ていた。",
    lede: "「PoC が出てから慌てる」では間に合わない種類の脆弱性。同じ日に Node.js も動いた。",
    points: [
      "<b>07:43 UTC</b> Cloudflare が修正公開前の攻撃試行を観測",
      "<b>14:00</b> PHP が修正版を公開 / <b>14:17</b> NVD が CVE を公開",
      "同じ日: Node.js 22.23.4 / 24.22.1 / 26.12.1（CAバンドル更新も同梱）",
      "公開の24時間、露出していた構成は侵害有無を別途確認する"
    ],
    metric: { val: "6h17m", label: "probes before the fix" },
    visual: { type: "clock", marks: [ ["07:43", 0.32], ["14:00", 0.58], ["14:17", 0.61] ] },
    cue: "alarm",
    sources: [
      { name: "docs/00 タイムライン", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/00-timeline.ja.md", note: "07:43 / 14:00 / 14:17" },
      { name: "CISA 緊急勧告", url: "https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching", note: "2026-10-21" }
    ]
  },
  {
    id: "gitlab",
    kicker: "GITLAB · CVSS 10.0",
    stamp: "10.21",
    title: "先週パッチを当てていても、該当する。",
    lede: "10月12日の更新は 19.2 以降のみ。今回の修正版は、その1つ上。",
    points: [
      "<b>CVE-2026-110264</b> / Onigmo の整数オーバーフロー / 未認証 RCE / 7.0（2014）以降すべて",
      "修正: 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
      "10月12日にパッチを当てた環境も、19.2.9 未満なら再び該当（修正版はその1つ上）",
      "公開された回避策は無い。下げるなら到達性を消す"
    ],
    metric: { val: "10.0", label: "CVSS · unauthenticated" },
    visual: { type: "ladder", steps: ["19.5.1", "19.4.3", "19.3.6", "19.2.9", "19.1.9", "19.0.10", "18.11.13"], hot: 3, wide: true },
    cue: "confirm",
    sources: [
      { name: "GitLab パッチリリース", url: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/", note: "影響範囲・検知2つ" }
    ]
  },
  {
    id: "npm",
    kicker: "PACKAGE CHANNELS · FOUR INCIDENTS",
    stamp: "10.21",
    title: "配布物そのものが、攻撃面になった。",
    lede: "10月の8件はコード配布の問題。provenance は「どこで作られたか」しか言わない。",
    points: [
      "LiteLLM 1.107.0: 起動時に窃取。そっくりリポジトリ <b>Berri-AI</b> からビルド",
      "tensorlake@0.5.144: 失効させると <b>$HOME</b> を消す「人質トークン」",
      "@subql/common@5.8.3: インストール時と import 時の両方で起動",
      "GhostAction: 偽 security-audit.yml が <b>345</b> リポジトリの秘密と履歴を送出"
    ],
    metric: { val: "345", label: "repos swept · 16 minutes" },
    visual: { type: "packages", items: ["litellm", "tensorlake", "subql", "ghostaction", "railway", "zeabur", "opencode"] },
    cue: "glitch",
    sources: [
      { name: "StepSecurity (tensorlake)", url: "https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm", note: "2026-10-08" },
      { name: "StepSecurity (SubQuery)", url: "https://www.stepsecurity.io/blog/subql-ecosystem-compromised", note: "2026-10-05" },
      { name: "StepSecurity (GhostAction)", url: "https://www.stepsecurity.io/blog/ghostaction-returns", note: "2026-10-09" }
    ]
  },
  {
    id: "railway",
    kicker: "RAILWAY · ENVIRONMENT VARIABLES",
    stamp: "10.21",
    title: "環境変数は、秘密の置き場所だった。",
    lede: "「AI推論プロバイダを狙う一連の攻撃の一部」——ベンダ自身がそう書いた。",
    points: [
      "顧客の環境変数が暗号化のまま読まれ、一部は復号された可能性",
      "調査中は全デプロイを停止、上流プロバイダへ鍵の先制失効を依頼",
      "必要なのは「漏れたかもしれない鍵」ではなく<b>全部</b>のローテート",
      "SMTP パスワード、webhook 署名秘密、JWT_SECRET も環境変数の中にある"
    ],
    metric: { val: "ALL", label: "env vars to rotate" },
    visual: { type: "pillars" },
    cue: "whoosh",
    sources: [
      { name: "Railway 開示", url: "https://blog.railway.com/p/security-disclosure-wednesday-october-21st", note: "2026-10-21" }
    ]
  },
  {
    id: "sweep",
    kicker: "THE SWEEP · NVD, 14 DAYS",
    stamp: "10.22",
    title: "2週間で CRITICAL 120件。悪用は1件。",
    lede: "件数はリスクではなく、開示のまとめ方を測っている。CVSS の最大値も、他人の仮定を含む。",
    points: [
      "120件のうち <b>60%</b> は Oracle とコンシューマ IoT",
      "NVD の CPE 紐付けは <b>27%</b> — ベンダ別集計は3分の1しか見えない",
      "EPSS 最高は 3.0%。KEV 入りの Plex 96656 は <b>0.76%</b>（新しい CVE では使えない）",
      "CNA と NVD でスコアが割れる: MOVEit / TeamCity は 8.1（AC:H）と 9.8（AC:L）"
    ],
    metric: { val: "120 : 1", label: "critical CVEs : known exploited" },
    visual: { type: "bars", values: [120, 1], labels: ["CRITICAL", "KEV"] },
    cue: "confirm",
    sources: [
      { name: "NVD API 2.0", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL", note: "2026-10-08〜10-22" },
      { name: "EPSS API", url: "https://api.first.org/data/v1/epss", note: "確率は遅れる" },
      { name: "docs/13", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/13-recent-criticals.ja.md", note: "生き残った12件" }
    ]
  },
  {
    id: "closing",
    kicker: "WHAT IT MEANS",
    stamp: "NOW",
    title: "リスクは、書いたコードではない。",
    lede: "10月に壊れたのは「何のコードが動くかを決める信頼」の側。効く統制は地味で、ほとんどが設定です。",
    points: [
      "リリースの不変性と、インストール時の署名検証",
      "ハッシュ付きの版固定。`latest` を使わない。git タグとの差分を見る",
      "平文・長期の管理者資格情報を置かない。管理系は公開しない",
      "ベンダのDBは自分の鍵を保持していると考える（TeamUpdraft / Railway / Zeabur）"
    ],
    metric: null,
    visual: { type: "storm" },
    cue: "whoosh",
    sources: [
      { name: "docs/14 供給網の15件", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/14-supply-chain-oct2026.ja.md", note: "14件確認 / 1件未確認" },
      { name: "Repository", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident", note: "一次ソースと検証コマンド" }
    ]
  }
];
