# 2026年10月、供給網の波として — 検証できた14件と、できなかった1件

> **2026-10-25追記：** 当時のConnectWise「未確認」は、ベンダーとMicrosoftの一次報告で更新しました。[最新の確認と対応](25-snapshot-20261025.ja.md)。以下は10/22時点の検証記録です。

[English](14-supply-chain-oct2026.md) | [**日本語**](14-supply-chain-oct2026.ja.md)

2026-10-22、10月に壊れた15の事柄を並べた投稿が広く共有され、*「最大のリスクは、私たちが書く
コードではなく、私たちが信頼するコードなのかもしれない」* と締めくくられていました。

この文書はそのリストを、[`11`](11-week-of-oct-20.ja.md) が vx-underground のリストを扱ったのと
同じ方法で1件ずつ確認します。**15件のうち14件は一次ソースで裏が取れました。1件は取れません**
（ConnectWise — §4）。この区別は、スローガンより重要です。

## 1. リストの検証

状態: **vendor** = 当事者が公開、**research** = 発見者が公開、**unverified** = 2026-10-22 時点で
一次ソースが見つからない。

| # | 主張 | 実際に何だったか | 状態 | 出所 |
|---|---|---|---|---|
| 1 | Railway — 顧客の秘密が露出 | 環境変数が復号された可能性。デプロイ停止。全ローテート | vendor | Railway 開示 2026-10-21（[`11`](11-week-of-oct-20.ja.md) §2） |
| 2 | LiteLLM — PyPI と Docker が悪性 | 1.107.0 の wheel が Python 起動時に窃取コードを実行。そっくりリポジトリからビルド | research + vendor | [`10`](10-litellm-1-107-0.ja.md) |
| 3 | **Zeabur — インフラ侵害** | 内部資格情報の漏えい → 共有クラスタ＋GCP Dedicated。環境変数を読まれる | **vendor** | Zeabur 報告 2026-10-19 |
| 4 | OpenCode — AI API キー露出 | Console 事案。キー失効。ベンダの勧告は未公開 | 利用者報告のみ | [`11`](11-week-of-oct-20.ja.md) §3 |
| 5 | **OVHcloud CLI — 公式バイナリにバックドア** | v0.11.0〜v0.15.0 のリリース資産が94分間すり替え | **vendor（GHSA）** | GHSA-862f-55f5-vmvw |
| 6 | **Rank Math PRO — 公式プラグインにマルウェア** | 3.0.123 の一部ダウンロードにマルウェア。修正は 3.0.124 | **research + vendor** | Wordfence PSA、CVE-2026-111862 |
| 7 | **TeamUpdraft — 顧客データ侵害** | 顧客DBを読まれ、UpdraftCentral の接続キーで悪性プラグインを投入 | **vendor + research** | TeamUpdraft 告知、Wordfence PSA |
| 8 | ConnectWise — クラウドバックアップの身元が侵害 | — | **unverified** | Trust の RSS に該当なし（最新 2026-09-08） |
| 9 | **Tensorlake — npm パッケージ感染** | `tensorlake@0.5.144` が窃取＋ワーム＋「人質トークン」（失効させると `$HOME` を削除） | **research** | StepSecurity 2026-10-08 |
| 10 | **SubQuery — npm バックドア** | `@subql/common@5.8.3` が資格情報を収集し遠隔シェルを開く | **research** | StepSecurity 2026-10-05 |
| 11 | **GhostAction — 悪性ワークフロー** | 乗っ取られたメンテナが偽 `security-audit.yml` を345リポジトリへ | **research** | StepSecurity 2026-10-09 |
| 12 | PHP — 重大な RCE | php2shell、5.4.0 以降 | vendor | [`01`](01-php2shell.ja.md) |
| 13 | Node.js — 修正済み | 22.23.4 / 24.22.1 / 26.12.1 | vendor | [`02`](02-nodejs-oct2026.ja.md) |
| 14 | eMudhra — CA 鍵の侵害 | 中間CA 8本、弱い鍵、1本は `4` | vendor + research | [`03`](03-emudhra-ca.ja.md) |
| 15 | **Tailscale — eMudhra 事案** | クライアントが当該中間CAを信頼。v1.104.2 で修正 | **vendor** | bulletin TS-2026-013 |

15件のうち8件は `npm` / `pip` / プラグイン / リリース資産の問題——コードではなく**コードの配布**です。
それが10月の実際の形で、投稿の締めの一文が刺さる理由でもあります。

## 2. このリポジトリに無かったもの

### 2.1 Zeabur — 平文の資格情報、2か月で2回目

- **2026-10-14 01:36 → 10-15 21:05 UTC**: 攻撃者は Zeabur 内部の AWS キーと共有クラスタの
  管理者トークンを使い、プラットフォームDBから環境変数とサービスの秘密を読んだ。**865** の
  データベースサービスでコマンドを実行（すべて成功したわけではない）。9リージョンの共有
  クラスタと GCP Dedicated Servers が対象。
- **Zeabur 自身が述べた原因**: 長期間有効な管理者資格情報が**平文**でプライベートな設定
  リポジトリに置かれ、管理画面はインターネットから到達可能で、トークンに有効期限が無かった。
- **なぜ繰り返したか**: 8月の事案でのローテーションが、今回使われた資格情報をカバーしていな
  かった。8月の案内に従って環境変数を自前の Dedicated Server へ移した利用者は、DB読み取りの
  範囲外。
- 公開は **2026-10-19**。「confirmed / assessed / cannot be confirmed / hypothesis」という
  **証拠の質を明示する語彙**を使っている点が、報告書として最も再利用価値が高い部分です。

### 2.2 OVHcloud CLI — 94分の窓と、リリースの不変性という統制

- 侵害された OVHcloud の **GitHub 開発者アカウント**が、**2026-10-19 14:47〜16:21（UTC+2）**に
  リリース資産を悪性バイナリへ差し替えた。
- 対象は **v0.11.0〜v0.15.0**。影響するのはその時間帯にインストール／ダウンロードした利用者
  だけで、同じ版をそれ以前に取得した人は影響なし。
- ソースコードとビルドチェーンは**影響なし**——ビルド汚染ではなく、資産の差し替え。
- OVHcloud が示した原因は「リポジトリが**リリースの不変性（immutability）**を保証する設定に
  なっていなかった」。設定ひとつが、あなたとバックドア入りバイナリの間に立っています。

### 2.3 Rank Math SEO PRO — CVE-2026-111862、CVSS 9.8

- **3.0.123** の一部のダウンロードが悪性。期間は **2026-10-15 20:02 UTC 〜 10-16 07:12 UTC**。
- 修正版は **3.0.124**。Wordfence の分類は「未認証の埋め込み悪性コード」、**9.8**、
  `CVE-2026-111862`。
- 影響版が稼働していたなら、**更新は対策になりません**。ペイロードが管理者アカウント、追加
  ファイル、定期タスクを作っている可能性があります。Wordfence の案内は「侵害済みとして調査」。

### 2.4 TeamUpdraft — DBが数千サイトへの入口だった

- **2026-10-17/18 の週末**に `teamupdraft.com` へ不正アクセス。顧客DBが読まれた: 氏名、メール、
  請求先住所、注文履歴、**ハッシュ化された**パスワード、2FA設定、そして **UpdraftCentral /
  UpdraftVault / UpdraftClone の接続キー**。カード情報は保持していない（Stripe/PayPal）。
- そのキーを使い、接続済みの WordPress サイトへ**正しく署名された**コマンドを送り、プラグインを
  アップロード・有効化・削除。署名が本物なので、以前の UpdraftPlus 修正（`CVE-2026-10795`）を
  適用済みのサイトでも正当な指示として受理された。
- ベンダの対応: 全アカウントをサインアウト、**UpdraftPlus 1.26.13 / 2.26.13** が
  **10月18日 22:00 BST 以前**の UpdraftCentral 接続を自動切断、Vault/Clone の鍵をローテート、
  ICO へ報告。
- 直接の危険があるのは接続キーを持つサイトだけ。ただし判断基準は「UpdraftPlus 無料版だから
  大丈夫」ではなく、**「クラウドの UpdraftCentral に接続しているか」**です。

### 2.5 Tensorlake — 後片付けを罰するパッケージ

- **`tensorlake@0.5.144`**（npm）はインストール時に資格情報を盗み、他のパッケージやリポジトリへ
  広がろうとし、さらに**罠**を仕掛ける: 盗んだ GitHub トークンを失効させると、マシン上の
  バックグラウンドジョブが**ホームディレクトリを削除**する。
- `tensorlakeai/tensorlake` の **main ブランチへ直接**、メンテナ名義で push され、そのリポジトリ
  からリリースされた。だから npm は**有効な provenance attestation** を表示する。provenance は
  「どこでビルドされたか」しか言わず、「安全か」は言いません。
- 到達可能なリポジトリに `.claude/settings.json` と `.vscode/tasks.json` を書き込み、Claude Code
  や VS Code で開いたときに再実行される。

### 2.6 SubQuery — インストール時と import 時の両方で動く

- **`@subql/common@5.8.3`** に隠しペイロード。資格情報を収集し、遠隔シェルを可能にする。
  **インストール中**と**import 時**の両方で起動。標的は開発者のワークステーションと CI
  （GitHub Actions）、およびそこから届くクラウド資格情報。

### 2.7 GhostAction — 2つの自動化された窓で345リポジトリ

- **2026-10-08**、乗っ取られたメンテナのアカウントが `security-audit.yml` を装ったワークフロー
  を **345リポジトリ**へ push。13:20 UTC に `pyxel` 作者のアカウントから27件、8時間後に別の
  アカウントから **16分間で318件**（21:10〜21:26 UTC）。
- ワークフローは CI/CD の秘密と**git 履歴全体**を、ハードコードされた IP へ**平文 HTTP** で
  送り出す。「セキュリティ改善」を装っているのが、最もレビューされにくいという点です。

### 2.8 Tailscale — CA 侵害が VPN クライアントに届くまで

- ブリテン **TS-2026-013**（2026-10-21）: *「eMudhra の TLS 中間CAの秘密鍵漏えい」*。
- Tailscale は TLS 検証に**ホストOSのトラストストア**（＋同梱の Let's Encrypt 証明書）を使い、
  ストアが信頼する証明書で署名された接続を受理する。eMudhra の中間CAが偽造可能になった時点で、
  それを信頼していた全 Tailscale クライアントが同じ問題を継承した。
- 修正は **v1.104.2**、Go を **1.27.3** に更新すること——つまり Go の x509 拒否リストを取り込む
  こと（[`03`](03-emudhra-ca.ja.md) §6）。CA の侵害が、CAから3層離れたクライアント更新の問題に
  変わります。

## 3. この波に共通すること

新しい8件のうち6件は、1つの文に集約できます: **「何のコードが動くかを決める信頼」の側が弱点だった。**

- リリースの不変性（OVHcloud）、provenance attestation（Tensorlake）、メンテナの身元
  （GhostAction）、プラグインの更新経路（Rank Math）、バックアップの接続キー（TeamUpdraft）、
  平文の管理者資格情報（Zeabur）。

どれもメモリ安全のバグではなく、WAF ルールでも直りません。効いたはずの統制は地味で、ほとんどが
設定です。

| 統制 | 止められたもの |
|---|---|
| リリースの不変性＋インストール時の署名検証 | OVHcloud |
| ハッシュ付きの版固定、`latest` を使わない、git タグとの差分レビュー | LiteLLM、Tensorlake、SubQuery |
| 平文・長期間の管理者資格情報を置かない、短い期限、管理系は非公開 | Zeabur、Railway |
| 外部コントリビュータ由来のワークフローをレビュー、`pull_request_target` の衛生 | GhostAction |
| 接続キーのローテート、ベンダDBの侵害を自分の侵害として扱う | TeamUpdraft |
| **どのクラウドサービスに接続キーを渡したか**の棚卸し | TeamUpdraft、Railway、OpenCode |

## 4. 裏が取れなかった1件

**ConnectWise — 「クラウドバックアップの身元が侵害」**。2026-10-22 時点で、このリポジトリは
**一次ソースを見つけられませんでした**。ConnectWise のセキュリティブリテン RSS は
`2026-09-08-screenconnect-bulletin` より新しい項目が無く、Trust ページにも10月の記載がありません。
事実でまだ公開されていないだけかもしれないし、古い BCDR/R1Soft の事案の誤読かもしれません。
**事実として繰り返さず「未確認」として記録します**——それがこのリポジトリの規律であり、
15件のリストはまさに「1行の誤りが隠れる場所」です。

## 5. やること（1ページ）

1. **依存ではなく「信頼の判断」を棚卸しする。** 各プロジェクトについて: 成果物はどこから来るか、
   誰が差し替えられるか、その差し替えは検証されるか。答えはリリースの不変性と署名検証。
2. **ベンダのDBは自分の鍵を保持していると考える。** TeamUpdraft、Railway、Zeabur は同じ結末——
   他人のDBに、自分に届く資格情報が入っていた。**どのベンダに接続キーを渡したか**を一覧にし、
   自分の事案ではなく**相手の事案で**ローテートする。
3. **「更新があります」はニュースであって対策ではない。** Rank Math と TeamUpdraft は、パッチ後も
   永続化の調査が必要でした。
4. **ワークフローファイルを読む。** GhostAction はこのリストで最も安価な攻撃で、最も見落とされる。
   硬化に見えるからです。
5. **CAが壊れたら、トラストストアを辿る。** Tailscale の修正は Go の版更新でした。静的バイナリ、
   コンテナのベース、言語ランタイムは、それぞれ自分で対応が要ります（[`03`](03-emudhra-ca.ja.md) §6）。

## 6. 出所

- Zeabur: <https://zeabur.com/blogs/october-2026-security-incident>（2026-10-19）
- OVHcloud CLI: <https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw>
- Rank Math: <https://www.wordfence.com/blog/2026/10/rank-math-seo-pro-3-0-123-malware/>
  （CVE-2026-111862）
- TeamUpdraft: <https://teamupdraft.com/blog/security-incident-october-2026/> と
  <https://www.wordfence.com/blog/2026/10/updraftcentral-connection-key-compromise/>
- Tensorlake: <https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm>
- SubQuery: <https://www.stepsecurity.io/blog/subql-ecosystem-compromised>
- GhostAction: <https://www.stepsecurity.io/blog/ghostaction-returns>
- Tailscale: ブリテン TS-2026-013 <https://tailscale.com/security-bulletins> と
  **v1.104.2** のチェンジログ（2026-10-21）
- きっかけになったリスト: Juampi（@juampitech）、2026-10 — **二次**。索引としてのみ使用
