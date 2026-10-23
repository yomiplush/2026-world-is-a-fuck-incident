# php2shell — PHP 本体の RCE 2件（CVE-2026-109618 / CVE-2026-109619）

[English](01-php2shell.md) | [**日本語**](01-php2shell.ja.md)

コミュニティ名 "php2shell"（漏洩した Exploit ツールの名前から）。防御側が知るべき点に絞る。

## 1. 何が脆いのか

| 項目 | 内容 |
|---|---|
| 影響 | **PHP 5.4.0（2012年）以降の全リリース** |
| SAPI | php-fpm / Apache mod_php / php-cgi / FrankenPHP / LiteSpeed。**Web リクエストを処理する全て** |
| 修正 | 2026-10-21 公開。8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 |
| 8.1 以前 | **公式修正なし**。PHP プロジェクトは 7.4 / 8.0 / 8.1 向けの「最小ソースバックポート」を別途公開 |
| CVSS | v4.0 **9.2**（両方、PHP 自身の評価）。NVD の v3.1 は **109618 が 9.8 / 109619 が 8.1**（2026-10-22 に再評価。下記） |
| 攻撃条件 | 認証不要。ただし複雑度は High（`AC:H`） |
| 悪用 | 公開済み。修正公開前の 07:43 UTC に攻撃試行を観測 |

**最重要**: 脆弱性は `php-src` のリクエスト処理の中にある。アプリのコード、フレームワークの
ルータ、プラグイン、パスベースの WAF は**すべて素通りする**。だから「アプリは最新です」は
対策にならない。

**2件の v3.1 スコアはもう同じではありません。** NVD は 2026-10-22 21:17Z に
`CVE-2026-109619` を 9.8 → **8.1** へ動かしました（`AC:L` → `AC:H`）。109618 は 9.8 のまま、
PHP 自身の CVSS 4.0 は両方 9.2 のままです。修正版・影響範囲・下記の緩和策は変わりませんが、
「9.0 以上だけ見る」トリアージでは**このアドバイザリの片側が黙って消えます**。適用は
スコア単位ではなくアドバイザリ単位で（[`docs/19` §2](19-snapshot-0730jst.ja.md)）。

## 2. 2つの CVE は別物

### CVE-2026-109618 — OOM 時のリクエスト状態破壊

PHP はメモリ確保失敗（OOM）を `longjmp()` で処理し、リクエストの処理を打ち切る。この経路の
一部で、リクエストメモリが**未初期化のまま**後段に渡る。その後のクリーンアップが不正な
データを有効なものとして扱い、RCE に至る。

攻撃側から見た実体は **upload-progress の unserializer の use-after-free** で、以下の副次効果がある:

- **worker が解放したメモリが `PHPSESSID` 応答 Cookie に載って返る**（Sansec の分析）。
  Heartbleed に似た情報漏洩で、他リクエストのパスワード、セッショントークン、API キー、
  TLS 秘密鍵が含まれ得る。
- この経路は `session_start()` を呼ばないアプリでも動く（ハンドラがアプリコードより先に走るため）。

### CVE-2026-109619 — 残留グローバル状態の再利用

PHP はリクエストメモリを指すグローバル状態をいくつか持つ。一部のシナリオで、その状態が
リセットされない、あるいはリセット後に再び埋められる。結果として、**解放済みのメモリを
指したまま**になる。同じ worker が次のリクエストを処理するとき、正常な初期化が上書きする前に
その古い状態を読むと RCE に至る。OPcache の型混同を伴う。

## 3. だから緩和は「機能単位」で切る

パターンフィルタでは消せない。**既知のトリガーはすべて `multipart/form-data` のリクエスト本文**
（Sansec）。パスを見るルールでは見えない。

| 対象 | PHP 公式が示した緩和 | 効果の限界 |
|---|---|---|
| 109618 | `memory_limit = -1` を**アプリが上書きできない形**で設定（FPM プールの `php_admin_value`、Apache 設定）。加えて `post_max_size` を小さく（アップロード不要なら 8M、必要なら 32M）、`upload_max_filesize` はその下 | メモリ上限を跨ぐ失敗は消えるが、**確保失敗そのものは残る** |
| 109619 | `session.upload_progress.enabled = 0` を `php.ini` / FPM プール / サーバ設定で。PHP 8.5 は `fatal_error_backtraces = 0` | **確認済みの経路のみ**。他の変種は塞げない |
| 両方 | `multipart/form-data` を Web サーバで拒否（Sansec の推奨） | ファイルアップロードが壊れる。業務次第で使えない |

設定は `conf.d` のドロップインか FPM プールに置く。**`.user.ini` と `ini_set()` は不可**——
PHP 公式が明記している。前者はリクエスト解析より後に読まれ、後者は管理者権限の設定を
上書きできないため。

FPM プールでの書き方（例）:

```ini
; /etc/php/8.3/fpm/pool.d/www.conf
php_admin_value[memory_limit] = -1
php_admin_value[post_max_size] = 8M
php_admin_flag[session.upload_progress.enabled] = off
; PHP 8.5 のみ
php_admin_value[fatal_error_backtraces] = 0
```

`memory_limit=-1` は**可用性のリスクと引き換え**。1リクエストがサーバのメモリを使い切れる。
cgroup / コンテナのメモリ上限を別に置き、影響を受けた worker だけが死ぬようにする
（PHP 公式は `RLIMIT_AS` / `RLIMIT_DATA` を代替に使うなと明記。脆弱な確保失敗を誘発するため）。

## 4. エコシステム側の穴

- **Remi リポジトリ**（RHEL 系で一般的）は 10-21 に更新を出さなかった。PHP 公式が
  「ディストリ配布パッケージかソースビルドに切り替えろ」と異例の明記をしている。
- **8.1 以前は公式サポート外**。修正版が存在しないので、緩和で凌ぐか、止めるか、上げるかの三択。
- **2026-10-22 に、その穴を埋めるコミュニティ製バックポートが出ました。** 選択肢が「悪い3択」から
  「レビューが必要な4択」に変わります。Oleksii Molchanov が公式の最小修正（php-src
  `712e60f9ed`、7.4 向けバックポート）をベンダのソースツリーへ移植し、
  `php-5.4.16-48.el7.php2shell.1` と `php-5.3.3-50.el6_10.php2shell.1` として公開
  （<https://github.com/alvm/php2shell-eol-backport>）。Leon Lai の Amazon Linux / PHP 7.3 on
  EL7 向けを拡張したものです。**ベンダの更新ではありません**。誰も追跡せず、これらのビルドに
  ついて CVE レコードが「修正済み」になることもありません。自分でレビューして再ビルドできる
  つなぎとして扱い、移行計画は残してください。
- **家電・アプライアンス・管理インタフェースに埋め込まれた PHP** は、管理者が PHP を
  直接更新できない。ベンダ待ちになる。NCSC-NL が対象製品リストを SPDX で管理している。
- 規模（VirusTotal の観測、The Record 経由）: PHP を動かす IP が約 510 万、うち約 75.8 万が
  EOL 版、修正直前の最新版は約 8.5 万。

## 5. 検知の信号（攻撃コードを持つ必要はない）

| 信号 | 意味 |
|---|---|
| 新規・改変された `.php` ファイル | Web シェルの設置（最も直接的な痕跡） |
| アップロードディレクトリ配下の `.php` | 正当なファイルと外見が区別できない。**ベースラインにあっても検出扱い**にする |
| 5xx の急増 | クラッシュする php-fpm worker。UAF の外的な見え方 |
| php-fpm worker からの不審な子プロセス / 外向き通信 | 実行後の段階 |

ATT&CK 対応: T1190（公開アプリの悪用）→ T1505.003（Web シェル）→ T1059.004（Unix シェル）
→ T1041（C2 経由の持ち出し）。

## 6. 出所

- PHP 公式勧告: <https://www.php.net/archive/2026.php#2026-10-21-5>
- NVD: <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-109618>
- Sansec: <https://sansec.io/research/php2shell>（攻撃チェーン、multipart、メモリ漏洩）
- NCSC-NL: <https://github.com/NCSC-NL/php2shell>（CERT-EU 版の運用情報、対象製品リスト）
- Cloudflare: <https://blog.cloudflare.com/php-vulnerabilities-waf-protection>
- The Record: <https://therecord.media/php-foundation-statement-critical-vulnerabilities>（発見の経緯）
