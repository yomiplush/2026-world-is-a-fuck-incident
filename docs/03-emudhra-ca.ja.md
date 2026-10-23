# eMudhra の CA 侵害 — 8本の鍵、そのうち1本は `4`

[English](03-emudhra-ca.md) | [**日本語**](03-emudhra-ca.ja.md)

**ソフトウェアの脆弱性ではありません。** 公開CA（インドの eMudhra）の**中間CA 8本の秘密鍵**が
侵害されました。中間CA なので、鍵を持つ者は**任意のドメイン**に対して、ブラウザが受け入れる
証明書を発行できます。

この文書は 2026-10-22 に書き直しました。初版は「複数の中間CA」と書き、ルートを2つ挙げていました。
どちらも曖昧すぎました。実際は**8本**で、理由は盗難より悪い——**鍵がそもそも強くなかった**のです。

## 1. 何が侵害されたのか

**2025年4月の鍵生成セレモニー**で作られた中間CA 証明書8本です。

| 種別 | 証明書 |
|---|---|
| TLS（ドメイン検証） | `EM DV TLS CA - G3B`（eMudhra BV、オランダ）、`EM DV TLS CA - G3C`（eMudhra Inc、米国） |
| TLS（組織検証） | `EM OV TLS CA - G3B`、`EM OV TLS CA - G3C` |
| TLS（拡張検証） | `EM EV TLS CA - G3B`、`EM EV TLS CA - G3C` |
| **コード署名** | `EM OV CS CA - G3B`、`EM OV CS CA - G3C` |

TLS の6本は `emSign Root TLS CA - G3` 経由で `emSign ECC Root CA - G3` に連なります。
**8本すべてが、2025年5月に Sectigo の `AAA Certificate Services` ルートでクロス署名**されています
——初版が Comodo/AAA を挙げていたのはこのためで、更新していないストアではこの第2の信頼経路が
今も有効です。


### 1.1 8本の証明書（grep できるハッシュ付き）

Cisco Talos が Mozilla のバグ報告から転記した一覧です。SHA-256 の全値は Talos と Mozilla の
投稿にあり、先頭24桁あればトラストストアのダンプから特定できます。

| 証明書 | 保有者 | CCADB | SPKI の SHA-256 | 発行者 |
|---|---|---|---|---|
| `EM EV TLS CA - G3B` | eMudhra BV | `A012304` | `E7568FE6E12331F4FD7DE61D…` | `emSign Root TLS CA - G3` |
| `EM OV TLS CA - G3B` | eMudhra BV | `A012308` | `98B896625C0C230ADEEC3EB2…` | `emSign Root TLS CA - G3` |
| `EM DV TLS CA - G3B` | eMudhra BV | `A012302` | `42C4ACCD12C4F59597925E1A…` | `emSign Root TLS CA - G3` |
| `EM EV TLS CA - G3C` | eMudhra Inc | `A012296` | `432EC25F0D28DE9006D97BF7…` | `emSign Root TLS CA - G3` |
| `EM OV TLS CA - G3C` | eMudhra Inc | `A012300` | `CB6E15165AC802E9B3F993F1…` | `emSign Root TLS CA - G3` |
| `EM DV TLS CA - G3C` | eMudhra Inc | `A012294` | `0164D7CEAE5BB909C272AF15…` | `emSign Root TLS CA - G3` |
| `EM OV CS CA - G3B` | eMudhra BV | `A012306` | `9E39DE2881273ACC225A149C…` | `emSign Root CS CA - G3` |
| `EM OV CS CA - G3C` | eMudhra Inc | `A012298` | `4B2460A466F95FD40113BCDC…` | `emSign Root CS CA - G3` |

発行者に注目してください。TLS の6本は `emSign Root TLS CA - G3`、コード署名の2本は
`emSign Root CS CA - G3` に連なります——多くの解説が挙げるルートとは**別のルート**です。

## 2. なぜ破れたか: 鍵が小さい整数だった

ここが覚えておく価値のある部分で、攻撃者が何かを盗んだ話ではありません。


### 2.1 セレモニーで何が起きたか（Talos の説明）

**2025-04-30**、eMudhra は `emSign Root TLS CA - G3`（`Comodo AAA Certificate Services` で
クロス署名）の下で**24本の下位CA**の鍵生成セレモニーを実施しました。**wrap/unwrap 工程の不具合**
により P-384 鍵の「2セット目」が生成され、そちらは 384 ビットではなく **3〜8 ビット**の
エントロピーしか持たず、その弱い鍵が8本の中間CAに使われました。Ars Technica は8個の値を
列挙しています——**4, 56, 66, 115, 155, 156, 230, 237**。

これが理論でない証拠として、`emudhra.we-have-a-problem.com` の非公式勧告には
*「We have a problem here – Wayne.」* というメッセージが、**当該証明書の秘密鍵でデジタル署名**
されて載っていました（Ars Technica）。秘密であるべき鍵で署名を見せることが、それ自体で
全部の説明になっています。

- P-384 の楕円曲線鍵です。秘密鍵は整数 `d` そのもので、公開鍵は `d × G`。
- セレモニーは `d` を**十分な乱数で生成しなかった**ため、`d` は*小さい*数になりました。
- Scott Helme は公開証明書から8本すべてを**ノートPCで1秒未満**で復元しました。1本は `4`、
  別は `56`、また別は `115` だと報告しています。
- 報告スレッドでの Ian Carroll の要約: *「本質的に弱い1バイト鍵で、誰でも因数分解できる。
  封じ込めは不可能」*。

正しい理解は「誰かが鍵を持っているかもしれない」ではなく、**「全員が鍵を持っている」**です。
対策は失効だけ。検知ルールは書けず、ローテーション計画も役に立ちません。

## 3. 時系列（UTC、ベンダ自身の投稿より）

| 時刻 | 出来事 |
|---|---|
| 2026-10-17 18:05 | Chrome Root Program が研究者から報告を受ける |
| 2026-10-17 19:45 | Chrome が裏取りを終え、**SPKI ハッシュ**でブロックする **CRLSet** を配信（再起動不要） |
| 2026-10-17 20:06 | Mozilla が報告を受ける |
| 2026-10-17 22:59 | Mozilla の **OneCRL** 更新が標準構成の Firefox 全台に到達 |
| 2026-10-19 22:00頃 | Android / Googlebooks が **Google Play Services** 経由で同等のブロックを受信 |
| 2026-10-20 | Chrome と Mozilla が公開。Chrome は **`emSign ECC Root CA - G3` を Chrome Root Store から削除**し、CT ログもこのCAへの連鎖を拒否するよう更新 |
| 2026-10-21 | eMudhra が声明を公開。Firefox 158.0.1、ESR 115.43.1、ESR 153.5.1 が出荷、NSS 3.131.1 がルートを削除 |

証明書のシリアルではなく **SPKI ハッシュ**でブロックしたことが、これだけ速く効いた理由です。
同じ鍵を共有する証明書は、まだ誰も見ていないものまで含めて無効になります。

## 4. TLS への実害は？ ベンダの見立ては「封じ込め済み」

- eMudhra: 影響を受けた中間CA のうち**1本だけ**が本番に配備され、**その1本を含めて
  エンドエンティティ証明書を発行していない**。crt.sh の公開 CT ログで裏付け済み。
- Chrome: ブロック前に、**TLS 用6本に連なる TLS 証明書は CT に記録されていなかった**。
  したがって CT を強制するクライアント（Chrome、Android アプリなど）に対して、偽証明書が
  信頼された可能性はない。
- CT ログ自体も、このCAへの連鎖を拒否するようになりました。

HTTPS については本当に安心できる結果です。**ただし §5 を読んでから緩めてください。**

## 5. 注意点: CT はコード署名を対象にしていない

8本のうち2本は**コード署名**用です。Certificate Transparency は TLS の仕組みで、
コード署名証明書の公開ログはありません。つまり:

- 「このCAの CT 記録が無い」は、コード署名用2本について**何も語りません**。
- 偽造されたコード署名証明書はフィッシングの問題ではなく、Windows/macOS/Java/.NET の検証経路で
  **「このバイナリは信頼された発行元が署名している」**という意味になります。
- eMudhra は「これらのCAもエンドエンティティ証明書を発行していない」と述べていますが、それは
  自社の記録でしか確認できず、公開ログでは裏付けられません。

実務的には: 2025年4月〜2026年10月の間に `EM OV CS CA - G3*` の連鎖で署名された成果物は、
再検証できるまで信頼しないこと。プラットフォーム側がこれら連鎖のコード署名検証を厳格化すると
考えてください。**自分が署名者なら**、別CAの証明書に切り替えて再署名します。タイムスタンプでは
救われません。鍵が盗まれたのではなく**偽造可能**だからです。


## 5.5 後片付けの規模は？ Go の暗号担当者いわく「Heartbleed より大きい」

Cisco Talos と Ars Technica は、視野をブラウザの外へ広げています。

- **すでに止めたもの**: Chrome・Mozilla・Apple が TLS 6本を、**Microsoft がコード署名2本**を
  ブロック。eMudhra は証明書を失効させ、G3 ルート下での新規発行を停止（Talos）。
- **止まっていないもの**: 自前のトラストストアを同梱し、失効を反映しないもの——Docker
  イメージ、Kubernetes ノード、Terraform / Prometheus のビルド、Python の `certifi` コピー、
  メンテナンスされていない CLI ツール、IoT ファームウェア、「忘れられた Linux マシン」。
  Go の暗号担当 Filippo Valsorda の Ars へのコメント: *「これは Heartbleed より大きな
  後片付けになる。非常に長い尾が残る」*。
- **なぜ Go がこれを脆弱性として扱ったか**: Go は OpenSSL に任せず `crypto/x509` で X.509 検証を
  自前実装しているため、拒否リストをランタイムで配る必要がありました。これが
  `CVE-2026-111943`、**Go 1.27.3 / 1.26.10** で修正、8本すべての SPKI の SHA-256 で連鎖を
  フィルタします（Talos）。
- **直近で一番鋭いリスクはブラウザではない**: Talos も Ars も **VPN クライアント**とその他の
  非ブラウザ TLS 利用者を挙げています。政府による傍受が現実的な環境では特に。

「ブラウザが対応した」と「対応が終わった」は別のことです。ブラウザは**自分の分**を片付けただけです。

## 6. 誰が何を出したか、「修正」の意味

| 層 | 変更 |
|---|---|
| **Go** | `crypto/x509` がこの中間CAを拒否リストに入れ、`Verify` が連鎖に含む場合にエラーを返す。コミット `7f86f95`（2026-10-19）、**CVE-2026-111943**、Go の URGENT トラック。修正版は **1.27.3 / 1.26.10** と報道 |
| **Chrome / Android** | CRLSet（SPKI ブロック）＋ Chrome Root Store から `emSign ECC Root CA - G3` を削除＋ CT ログが連鎖を拒否 |
| **Firefox / NSS** | OneCRL でブロック。Firefox **158.0.1**、ESR **115.43.1**、ESR **153.5.1**、**NSS 3.131.1** がルートを削除（Mozilla のストアを使い OneCRL を受けないアプリを保護） |
| **Node.js** | 10月のリリース（**22.23.4 / 24.22.1 / 26.12.1**、[`02`](02-nodejs-oct2026.ja.md)）で同梱 CA リストを更新 |
| **Python** | `certifi` **2026.10.19** |
| **Rust** | `webpki-roots` **1.0.10** |
| **PHP** | `composer/ca-bundle` **1.6.0 / 1.4.16** |
| **Linux ディストリ** | Ubuntu **USN-8944-1 / USN-8944-2**、Debian **DSA-6572-1**、Red Hat **RHSB-2026-012**、Homebrew `ca-certificates` |
| **独立した解説** | Scott Helme の弱鍵解析（§8） |

**自前でトラストストアを持つものは、個別に更新が必要**です。OS を更新しても、そのコミット前の
`crypto/x509` でビルドした Go バイナリ、古い `ca-certificates` を持つ Node イメージ、古い
`certifi` の venv は直りません。

## 7. やること

### 7-1. 対象かどうかを決める

Red Hat の整理は今も有効で、TLS 傍受が成立するには3つすべてが必要です。

1. トラストストアがこれら中間CAを信頼している（更新していなければ真）。
2. 攻撃者が鍵を持つ（持っている——**誰でも**持っている）。
3. 攻撃者が TLS 接続を傍受できる位置にいる。

自分で制御できるのは 1 だけ。2 が恒久的に真になったことが、通常の鍵盗難と違う点です。

### 7-2. 自分が持つ層を更新する

```bash
# OS のトラストストア
sudo apt install --only-upgrade ca-certificates      # Debian/Ubuntu
sudo dnf upgrade ca-certificates                     # RHEL/Fedora
sudo pacman -Syu ca-certificates                     # Arch

# ランタイム同梱のストア — それぞれ別
python3 -c 'import certifi; print(certifi.__version__)'   # 2026.10.19 以上
go version                                                # 1.27.3 / 1.26.10 以上
node -p 'process.versions.openssl'                        # Node 更新後
composer show composer/ca-bundle 2>/dev/null | head -2
# Java は独自の cacerts（keytool -list）。編集せずイメージを作り直す
```

**Python 側は 2026-10-22 に下限を公表しました**（Seth Michael Larson、Python のセキュリティ対応）:
**emSign ルート**が `certifi` などのバンドルから削除されたため、作業は「中間CAの更新」ではなく
**ルートの削除**です。2026-10-23 10:36 JST 時点で PyPI を確認した下限:

| パッケージ | 下限 | 補足 |
|---|---|---|
| `certifi` | **2026.10.19** | 勧告の文面は 2026.10.18。影響を受けない emSign ルートとの互換性のため 10.19 推奨 |
| `pip` | **26.2.2** | 先に pip を上げ、その pip で残りを上げる |
| `uv` | **0.13.4** | 現行は 0.13.5 |
| `sigstore` | **4.5.1** | |
| `conda` | **26.9.4** | conda チャネル配布。PyPI では見えない |
| `pixi` | **0.82.1** | `pixi --version` で確認。PyPI の `pixi` はこのツールではない |

そして飛ばしやすい指示: **レイヤキャッシュを無効にしてコンテナイメージを再ビルドする**。
そうしないと「バンドル更新」の手順は、古いルートを含むキャッシュ層で満たされたことになります。
更新後にピン留めが失敗するのは想定どおりで、古いルートを固定していたサービスは検証に失敗します。
それが変更が効いている証拠です。

### 7-3. 直接信頼とピン留めを確認する

```bash
trust list 2>/dev/null | grep -i -A3 emudhra   # p11-kit
grep -ril emudhra /etc/ssl/certs/ 2>/dev/null | head
openssl version -d                             # 実際に使っているバンドル
```

アプリが eMudhra の中間CAをピン留めしているなら、その設定を削除します。**自組織の証明書が
eMudhra 系で発行されている場合は、別CAで再発行**してください。ルート削除により、正当な連鎖の
一部も動かなくなる——Chrome が明言しています。

### 7-4. やってはいけないこと

- 「様子を見る」。信頼の判断はブラウザ側で既に済んでいて、まだ信頼しているのは自分のホストです。
- `ca-certificates` だけを直して終わりにすること。自分が配布しているトラストストアを数える:
  OS、言語ランタイム、コンテナのベースイメージ、機器のファームウェア、`.NET`、Java の `cacerts`。
- CRL / OneCRL でのブロックを、コード署名の対策として説明すること（§5）。

## 8. 出所

- Cisco Talos「Compromised eMudhra intermediate certificates」（2026-10-21）— 8本の証明書と
  CCADB ID、セレモニーと wrap/unwrap の原因、Microsoft によるコード署名2本のブロック、
  Go の CVE と修正版:
  <https://blog.talosintelligence.com/compromised-intermediate-certificates/>
- Ars Technica「The Internet goes on high alert after discovery of 8 compromised TLS certs」
  （2026-10-20）— 8個の鍵の値、「We have a problem here – Wayne」の署名、Valsorda の
  Heartbleed 比較と長い尾のリスト（二次報道として明記）:
  <https://arstechnica.com/security/2026/10/the-internet-goes-on-high-alert-after-discovery-of-8-compromised-tls-certs/>
- Mozilla のバグ報告（証明書一覧の原典）:
  <https://bugzilla.mozilla.org/show_bug.cgi?id=2083449>
- 両記事が参照する非公式勧告サイト: <https://emudhra.we-have-a-problem.com/>
- Google（Chrome Root Program）2026-10-20 — SPKI ブロック、CT の見解、ルート削除:
  <https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/>
- Mozilla Security Blog 2026-10-20:
  <https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/>
- eMudhra 声明（更新1〜n、2026-10-20/21）。Mozilla の時系列の引用元でもある:
  <https://emudhra.com/en/post/certificate-security-incident>
- Scott Helme — 鍵の復元と小整数の説明:
  <https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/>
- Go: コミット `7f86f957633ee31a1c17a1eb8452ca7a3d9bc141`、
  issue <https://github.com/golang/go/issues/82345>、CVE-2026-111943
  （<https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111943>）
- 下流: <https://pypi.org/pypi/certifi/json>、<https://ubuntu.com/security/notices/USN-8944-1>、
  <https://security-tracker.debian.org/tracker/DSA-6572-1>、
  <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012>
- 二次（8本の一覧と範囲）: The Hacker News,
  <https://thehackernews.com/2026/10/eight-emudhra-ca-keys-compromised.html>
