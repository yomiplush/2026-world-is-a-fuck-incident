# Runbook — php2shell

対象: PHP が動いているホスト／コンテナ。所要 10〜30 分（修正版がある場合）。
**この手順は「発見 → 修正 → 検証 → 侵害時の対応」の順に並んでいる。飛ばさない。**

前提: `docker` グループ権限、`ssh`（リモートの場合）、`jq`、`curl`。
root は原則不要（エッジ操作とホストの ini 配置だけは要ることがある）。

---

## 0. 30秒で判断する

```bash
tools/php2shell/bin/p2s-audit --json                 # ローカル
tools/php2shell/bin/p2s-audit --target <ssh-host>    # リモート
```

| 終了コード | 意味 | 次 |
|---|---|---|
| 0 | PHP が無い、または修正版／緩和済み | §5 検証へ。何もしない |
| 10 | **PHP が動いていて、危険な設定が有効** | §1 へ |
| その他 | 実行失敗（ssh / docker グループ / 権限） | 環境を直してから再実行 |

`p2s-audit` は**読み取り専用**。何度実行しても安全。

---

## 1. 何が動いているかを確定する

```bash
tools/php2shell/bin/p2s-audit                    # 表形式で一覧
docker ps --format '{{.Names}}\t{{.Image}}'
docker exec <container> php -v                   # 実行中の版（タグではなく）
docker images --format '{{.Repository}}:{{.Tag}}\t{{.CreatedSince}}' | grep -i php
```

**停止中のイメージも確認する。** 起動していないだけで、起動すれば露出する。

```bash
docker images --format '{{.Repository}}:{{.Tag}}\t{{.CreatedSince}}' | grep -Ei 'nextcloud|wordpress|flarum|php'
```

数年前のイメージが残っていたら、起動前に必ず再取得する（[`../docs/06-lessons-and-gotchas.md`](../docs/06-lessons-and-gotchas.md) §11）。

---

## 2. 分岐

| 状況 | 手段 |
|---|---|
| 修正版イメージが存在する（`php:8.3.36` 等） | **§3 修正**。これが唯一の完全な対策 |
| 修正版がまだ無い／ベンダ待ち／8.1 以前 | **§4 緩和**で時間を稼ぐ。同時に移行計画を立てる |
| 露出していて、侵害の兆候がある | **§6 侵害時対応**。修正より先に遮断 |

---

## 3. 修正（最優先）

```bash
tools/php2shell/bin/p2s-patch --container <name> --dry-run
tools/php2shell/bin/p2s-patch --container <name>
```

やっていること: `pull` → 再作成 → **イメージダイジェストと PHP バージョンの前後比較**。
終了コード 10 は「新しいイメージがまだ公開されていない」。失敗ではないので §4 へ。

自前イメージの場合:

```dockerfile
FROM php:8.3.36-fpm-alpine
# 8.2.35 / 8.4.27 / 8.5.12 でも同じ
```

```bash
docker build -t <app>:php8.3.36 . && docker compose up -d --force-recreate --no-deps <service>
```

### 修正後の確認（必須）

```bash
docker exec <c> php -v      # 8.3.36 等になっているか
tools/php2shell/bin/p2s-audit --target <host>   # 10 が返らないこと
```

---

## 4. 緩和（**部分対策**。更新の代替ではない）

PHP 公式が「完全な修正ではない」と明記している手段。**効く範囲を理解して使う。**

### 4-1. ツールで入る分（CVE-2026-109619 側）

```bash
tools/php2shell/bin/p2s-mitigate --container <name> --dry-run
tools/php2shell/bin/p2s-mitigate --container <name>
docker exec <c> php -r 'echo ini_get("session.upload_progress.enabled");'   # 0 であること
```

これは compose override に ini をマウントする（`docker exec` で書き換えない）。
再作成後も残るのが利点。`--revert` で戻せる。

### 4-2. 手で入れる必要がある分（CVE-2026-109618 側）

`memory_limit` はアプリのメモリ挙動を変えるため、ツールは自動で入れない。

```ini
; conf.d/zz-php2shell-mem.ini  または FPM プール
memory_limit = -1
post_max_size = 8M
upload_max_filesize = 6M
```

FPM プール（`/etc/php/<ver>/fpm/pool.d/*.conf`）に書く場合:

```ini
php_admin_value[memory_limit] = -1
php_admin_value[post_max_size] = 8M
php_admin_flag[session.upload_progress.enabled] = off
```

- アップロードが必要なアプリなら `post_max_size` を 32M 程度に上げ、`upload_max_filesize` を
  その下に置く。
- **`memory_limit = -1` は可用性と引き換え**。コンテナ/cgroup のメモリ上限を別に設定し、
  影響を受けた worker だけが死ぬようにする。`RLIMIT_AS` / `RLIMIT_DATA` は使わない
  （脆弱な確保失敗を誘発する）。
- **`.user.ini` と `ini_set()` は不可**（PHP 公式が明記）。

### 4-3. トリガーそのものを落とす（任意・要検証）

既知のトリガーはすべて `multipart/form-data` の本文。

```nginx
# アプリのファイルアップロードが壊れるので、必ず検証してから入れる
if ($http_content_type ~* "multipart/form-data") { return 403; }
```

Apache:

```apache
RewriteEngine On
RewriteCond %{HTTP:Content-Type} multipart/form-data [NC]
RewriteRule ^ - [F]
```

入れたら**必ずアプリの主要動線（ログイン、投稿、アップロード）を触る**。
壊れたら即座に外す。修正版が入ったら外すのが前提の暫定策。

---

## 5. 検証

```bash
tools/php2shell/bin/p2s-audit --target <host>            # 露出なし
docker exec <c> php -v                                   # 実行中の版
docker exec <c> php -i | grep -E 'session.upload_progress|memory_limit|post_max_size'
tools/php2shell/bin/p2s-hunt --container <c> --target <host> --scan
bash tools/php2shell/tests/selftest.sh <host>            # 再起動を跨ぐ確認を含む
```

**再起動を跨いだ確認を省かない。** `docker compose up -d` で設定が静かに消える事故が起きる。
`selftest.sh` は最後にコンテナを再起動して、設定が残っているかを見る。

---

## 6. 侵害を疑うとき

**順序を守る: 遮断 → 保全 → 調査 → 再構築 → 認証情報のローテート。**
「掃除」を先にやると証拠が消える。

### 6-1. 兆候

| 兆候 | 確認方法 |
|---|---|
| 新規・改変された `.php` ファイル | `p2s-hunt --scan`（ベースラインとの差分） |
| アップロードディレクトリ配下の `.php` | 同上（ベースラインにあっても検出扱い） |
| 5xx の急増 | `p2s-hunt --logs --since 72h` |
| 不審な外向き通信 | `p2s-hunt --scan`（非ループバックのソケット） |

### 6-2. 手順

```bash
# 1. 遮断（消さない）
docker stop <container>

# 2. 保全
docker cp <container>:/var/www/html /tmp/evidence-html-$(date +%s)
docker logs <container> > /tmp/evidence-log-$(date +%s).txt 2>&1

# 3. 調査
tools/php2shell/bin/p2s-hunt --container <c> --target <host> --logs --since 72h
```

その後の順序:

1. **認証情報のローテート**: そのコンテナが読めたもの全部（アプリのログイン、DB、設定内の API キー）。
   **CVE-2026-109618 はメモリ漏洩を伴う**ので、同じ worker が扱った他リクエストの
   セッション・トークンも漏れた可能性がある。SSO のセッションも疑う。
2. **イメージから再構築する**。稼働中コンテナを「きれいにする」のは不可。
3. **横展開の確認**: コンテナが非ループバックへ通信していないか。Docker ソケットを
   マウントしていないか（していれば host 侵害を疑う）。
4. **入口の特定**: リバースプロキシ / CDN / SSO のログで、いつ・どのセッションが叩いたか。

---

## 7. エッジ（任意）

```bash
tools/php2shell/bin/p2s-edge --zone <zone> --dry-run       # 既定は dry-run
tools/php2shell/bin/p2s-edge --zone <zone> --apply
tools/php2shell/bin/p2s-edge --zone <zone> --php-host <host> --apply   # PHP を配信するホストを除外
```

入るもの: `.php`/`.phtml`/`.phar` のパス、`/cgi-bin/`、phpmyadmin / wp-login 等、
ドットファイル（`/.env` `/.git`）、PHP-CGI の引数注入マーカ。

**入らないもの**: リクエスト本文を見るルール。Cloudflare の Free プランでは
`http.request.body.raw` が使えない。ツールは拒否を検知して、そのルールだけ落とす。

> **重要**: エッジは「スキャナの波を止める」ための層であって、php2shell の本体対策ではない。
> **オリジン側（§3 か §4）が本体**。エッジを入れたことを対策完了の根拠にしない。

---

## 8. 定期的に回す

```bash
tools/php2shell/deploy/install.sh <ssh-host>    # 6時間ごとの systemd user timer
systemctl --user list-timers php2shell-watch.timer
journalctl --user -u php2shell-watch
```

`p2s-watch` は「PHP ランタイムの露出」「Web ルートの完全性」「**新しい PHP 面の出現**」を見る。
最後の項目が重要で、停止していた CMS を誰かが起動した瞬間に検知できる。

---

## 9. 既知のギャップ（意図的に未対応）

- **レート制限 / Fail2ban は未導入**。変更がリクエスト処理に影響するので、独立した作業窓が要る。
- **コンテナの外向き通信は制限していない**。侵害されたコンテナは持ち出し経路にもなる。
  `DOCKER-USER` での許可リスト化が次の段階だが、各コンテナの正当な通信先の棚卸しが前提。
- **LAN に公開しているポート**は別問題。Docker は `ufw` を迂回してポートを公開するので、
  「ufw で塞いである」は根拠にならない。php2shell とは独立に監査する価値がある。
