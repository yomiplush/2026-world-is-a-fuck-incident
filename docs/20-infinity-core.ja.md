# Infinity Core — カーネル中核の LPE 6件、PoC 公開済み、修正は既に出ている

[English](20-infinity-core.md) | [**日本語**](20-infinity-core.ja.md)

Linux カーネルの **タイマー / シグナル / メモリ管理 / Futex / スケジューラ / SLAB** に存在する
6件の脆弱性。`linux-distros` のエンバーゴ終了を受け、**2026-10-16 16:00 UTC（2026-10-17 01:00
JST）** に `oss-security` へ公開されました。うち5件は非特権のローカルユーザーから root を取得
でき、同じ5件でコンテナからホストへ脱出できます。残る1件は SLUB の partial list を壊し、
カーネルパニックを起こします。

**これは [`docs/17`](17-lkml-oct2026.ja.md) の6件とは別物です。** バグも研究者も公開経路も
違い、そして — あちらと違って — **上流で修正済み**です。両者の区別は §6。

名称・CVE 一覧・修正コミットは研究者自身の文書に基づきます:
**Hyunwoo Kim**（`@v4bel`）<https://github.com/V4bel/InfinityCore>。以下の記述は、その文書・
`oss-security` の投稿・カーネル CVE 告知の3つで確認しました。

## 1. 6件

| サブシステム | CVE | 影響 | 検証環境 | 混入 | 修正 |
|---|---|---|---|---|---|
| Timer | `CVE-2026-98260` | LPE / コンテナ脱出 / **Android LPE** | Ubuntu 26.04 `7.0.0-30-generic`、Galaxy S26 Ultra | `55e8c8eb2c7b` | `acb03d388181` |
| Signal | `CVE-2026-98256` | LPE / コンテナ脱出 | Ubuntu 26.04 `7.0.0-30-generic` | `fb3bbcfe344e` | `d2710c8d938a` |
| MM | `CVE-2026-89754` | LPE / コンテナ脱出 | Ubuntu 26.04 `7.0.0-30-generic` | `3b89863c3fa4` | `aedf2efd1897` |
| Futex | `CVE-2026-80775` | LPE / コンテナ脱出 | Ubuntu 26.04 `7.0.0-30-generic` | `d9b05321e21e` | `bde023808364` |
| Scheduler | `CVE-2026-98385` | LPE / コンテナ脱出 | Arch Linux `7.2.4-arch1-2` | `df0d98475954` | `28f9c0e0a0b9`, `b636fef85bda` |
| SLAB | `CVE-2026-97941` | カーネルパニック（LPE 連鎖は未実証） | Arch Linux `7.2.4-arch1-2` | `ba7425312607` | `4a724bcf5d70` |

6件中5件はオブジェクト寿命のメモリ安全性バグで、主題は同じです。指す先より長生きする参照
（`exec()` によるタスク同一性の入れ替え、`mm_struct` の置き換え、持ち主より長生きする per-CPU
状態）。SLAB の1件だけ形が違い、リスト破壊の競合です。個別には:

- **98260** — リーダー以外のスレッドで `exec()` が失敗すると、スレッド単位の POSIX CPU タイマー
  のノードが生きたタスクの timerqueue に残り、後の後始末が解放済みノードを辿る。
- **98256** — 終了するリーダーの pending `sigqueue` をロックなしで流す経路と、交換後の PID を
  辿って新しいリーダーのキューに要素を繋ぐ経路が競合し、要素が残ったままオブジェクトが解放。
- **89754** — ページテーブルウォーカの下位から retry 状態（`ACTION_AGAIN`）が漏れ、`mincore()`
  が同じ PUD 範囲を二度歩いて1ページの結果バッファを越えて書く。
- **80775** — 入れ子の `vfork()` で `mm_struct` を共有する2タスクが別々の per-CPU futex
  カウンタを公開し、参照が1つ失われて生きた private futex hash が解放される。
- **98385** — スケジューラのキャッシュ集計が、`exec()` に置き換えられて解放済みの
  `mm_struct` の per-CPU 統計へ書き続ける。
- **97941** — SLUB の refill 中、楽観的 freelist 返却と partial list からの削除が ABA 競合を
  起こし、同じリストノードが二度リンクされる。

クラウドで「単なるローカルのバグ」ではない理由は明快です。**コンテナはホストのカーネルを
共有します。** コンテナ内でコードを実行できる攻撃者（侵害されたアプリ、悪性の依存パッケージ、
フォークからの PR ビルドを走らせる CI）は、この5件でホストの root に到達します。研究者は
5件で脱出を実証しています。

**2つの限界も書いておきます。** 6件はいずれも遠隔・未認証ではありません。先にローカルで
コード実行（または共有ホスト上の非特権シェル）が必要です。またスケジューラの1件は条件付きで、
`CONFIG_SCHED_CACHE=y`、実行時に sched cache が有効、最上位 `SD_SHARE_LLC` ドメインが複数 CPU
かつ親ドメインがより広い、`sysctl_sched_cache_user` が非ゼロ、が必要です。PoC は 4 vCPU /
2 LLC を前提にしています。

## 2. Android の結果と、公開されていないもの

`CVE-2026-98260` は **Samsung Galaxy S26 Ultra**（ビルド `S948NKSS4BZIG`）の `untrusted_app`
サンドボックスから、追加のアプリ権限なしで root に到達できると報告されました。Android 向けの
攻撃コードは端末側が修正されるまで**非公開**で、公開されているのはハッシュのみです。

```
713a294f72abc46b6e12633117d40e85629ca2b998698fd75c76e523e0d53253
```

これは exploit ではありません。Linux サーバ向け PoC が公開されていることと、Android 向けが
非公開であることは別の事実です。混ぜないでください。

## 3. 修正は既に出ている — 番号ではなく起動中のカーネルを見る

`CVE-2026-98260` のカーネル CVE 告知は、修正を含むブランチを明示しています:

```
fixed in 6.6.158   with commit 6f1977cea3e8
fixed in 6.12.112  with commit d9ae467e617c
fixed in 6.18.54   with commit 75aa08b93c65
fixed in 7.2.8     with commit d602877baf36
fixed in 7.3-rc4   with commit acb03d388181
```

`CVE-2026-98385`（スケジューラ）はもっと狭く、告知には **7.2.9** と **7.3-rc5** だけが挙がり、
6.x へのバックポートは記載がありません。このスナップショット時点の最新は **7.2.12**、
**6.18.58**、**6.12.114**、**6.6.160**、**6.1.190** なので、現在の系列はいずれもタイマー系の
修正版を超えており、7.2.12 は 7.2.9 を超えています。ただしディストリビューションは自前の版番号へ
バックポートするため、この算術が言えるのは「**修正版カーネルが存在する**」ことで、
「**あなたのカーネルが修正済み**」ではありません。

```bash
uname -r                                  # いま動いているもの
# そのあと: ディストリのアドバイザリを CVE id で引き、*パッケージのリビジョン* を見る
# Debian/Ubuntu: apt changelog linux-image-$(uname -r) | head
# RHEL/Fedora:  rpm -q --changelog kernel | head -40
# Arch:         pacman -Qi linux | grep -E 'Version|Install Date'
```

**再起動までが修正です。** 修正済みカーネルを入れたまま古いカーネルで動き続けるのが、この手の
脆弱性が開いたまま残る最大の原因です。再起動後の `uname -r` だけが証拠になります。

優先順位は、研究者の整理と露出の観点から: **共有ホスト、Kubernetes のワーカーノード、CI /
ビルドランナー、複数ユーザーがログインするサーバ。** ここでは「ローカル」の敷居が低いからです。

## 4. 今週パッチを当てられない場合

いずれも**低減**であって修正ではありません。声に出してそう言うのが
[`docs/06`](06-lessons-and-gotchas.ja.md) の作法です。

1. **共有カーネルで信頼できないコードを走らせない。** フォークからの PR ビルド、試用プレビュー、
   マルチテナントのランナーは、専用ノードかカーネルを共有しないサンドボックスへ。
2. **シェルを取れる人を減らす。** 6件すべての入口は「ユーザー権限でのコード実行」で、これは
   侵害された依存パッケージが与えるものと同じです。
3. `seccomp`、LSM プロファイル、コンテナ権限の削減はコストを上げます。**6件すべてを止められる
   ことは確認されていません**し、許可済みシステムコールから到達するカーネル UAF は
   seccomp では消えません。
4. 「BPF とユーザー名前空間を無効化しているから安全」は誤りです。研究者はそれらの攻撃面を
   今回の対象から**意図的に除外**しています。それがこの集合の要点です。

## 5. 確認できたこと・できなかったこと

| 主張 | 状態 |
|---|---|
| 6件の CVE、サブシステム、影響、検証環境、修正コミット | 研究者の文書 **と** NVD の6レコード（カーネル CVE の文面）が一致 |
| 公開日とエンバーゴ | `oss-security` `Message-ID <atJKE2-xaxxpko2X@v4bel>`、`Sat, 17 Oct 2026 01:00:19 +0900`（= 2026-10-16 16:00 UTC） |
| 98260 / 98385 の修正ブランチ | カーネル CVE 告知（上に引用） |
| 現在の stable がすべての修正版より新しい | このスナップショット時点の kernel.org リリース索引 |
| 悪用は未確認 | KEV に登録なし。6件のいずれも CISA は収載していない |
| NVD の深刻度 | **6件中4件が 7.8**（`AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`、カーネル CVE チームの評価）。**`CVE-2026-80775` と `CVE-2026-98385` はスコア自体が無く**、6件すべて `vulnStatus: Received`。NVD は解析していない |
| Android の攻撃コードが存在する | 研究者の主張とハッシュのみ。独立検証は不可で、非公開は妥当 |

正直な要約: **バグの内容と修正は一次ソースで確認でき、深刻度の数字はできていません。**
今週「CVSS 9.0 以上」で絞っていたら、6件とも視界に入りません。

## 6. `docs/17` の6件とは別物

どちらも「Linux カーネルの6件」ですが、共通点は数だけです。

| | この文書（Infinity Core） | [`docs/17`](17-lkml-oct2026.ja.md) |
|---|---|---|
| 報告者 | Hyunwoo Kim、`linux-distros` 経由で調整 | 6件の報告が**公開** `linux-kernel@` へ（非公開リストではなく） |
| 識別子 | `CVE-2026-98xxx` / `-89xxx` / `-80xxx` | ZDI id（`ZDI-CAN-33549`、`-33774` など） |
| サブシステム | timer, signal, mm, futex, scheduler, SLAB | SMB Direct, ksmbd, skbuff, vmwgfx, nvmet, TCP |
| 影響 | ローカル root / コンテナ脱出（5件） | SMB 経路の**遠隔** RCE、CVSS 9.0 |
| 悪用材料 | 5件で PoC 公開、1件はパニック | 公開 PoC の報告なし |
| **修正状況** | **上流で修正済み。現行 stable に含まれる** | **2026-10-23 時点で mainline に修正なし** |
| KEV | なし | なし |

この2つから持ち帰るべきは1点です。**「カーネルの脆弱性」は行動可能な分類ではありません。**
効くラベルは「インストールして起動できる修正版カーネルがあるか」で、この2つの集合では答えが
正反対になります。

## 7. 出典

- 研究者の文書（6件、PoC、修正コミット、前提条件）: <https://github.com/V4bel/InfinityCore>
- 公開スレッド: <https://openwall.com/lists/oss-security/2026/10/16/36>
  （アーカイブのパスは UTC 日付。メール自体は 2026-10-17 01:00 JST）
- カーネル CVE 告知（CVE ごとの `Fixed in`）:
  <https://lists.openwall.net/linux-cve-announce/2026/10/06/118>（`CVE-2026-98260`）、
  <https://lists.openwall.net/linux-cve-announce/2026/10/12/1>（`CVE-2026-98385`）、
  <https://lists.openwall.net/linux-cve-announce/2026/10/06/114>、
  <https://lists.openwall.net/linux-cve-announce/2026/09/25/198>、
  <https://lists.openwall.net/linux-cve-announce/2026/09/04/14>
- NVD レコード: `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-98260`（他5件）
- 現行 stable: <https://www.kernel.org/releases.json>
- 発見のきっかけになった日本語の解説（二次。だから一次を確認する）:
  <https://rocket-boys.co.jp/security-measures-lab/linux%e3%82%ab%e3%83%bc%e3%83%8d%e3%83%ab%e3%81%ab6%e4%bb%b6%e3%81%ae%e8%84%86%e5%bc%b1%e6%80%a7%e3%80%8cinfinity-core%e3%80%8d%e3%80%815%e4%bb%b6%e3%81%a7root%e6%a8%a9%e9%99%90%e6%98%87%e6%a0%bc/>
