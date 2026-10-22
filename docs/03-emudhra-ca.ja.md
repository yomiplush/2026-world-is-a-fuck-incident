# eMudhra 中間CA 秘密鍵の侵害（2026年10月）

[English](03-emudhra-ca.md) | [**日本語**](03-emudhra-ca.ja.md)

**ソフトウェアの脆弱性ではない。** 公開CA（eMudhra）の**中間CA の秘密鍵が侵害**された事案。
TLS の信頼の連鎖に関わるので、サーバ運用者にも影響する。

## 1. 何が起きたか

- eMudhra の**複数の中間CA 証明書の秘密鍵が侵害**された。
- 当該中間CA は次の2つのルートCA に署名されている:
  - **Comodo AAA Services root**
  - **emSign ECC Root CA - G3**
- 秘密鍵を持つ攻撃者は、**任意のドメインに対して正規に見える証明書を発行できる**。
  MITM の位置にいれば、TLS を復号・改変できる。

## 2. 影響する条件（3つすべてが揃うとき）

Red Hat の整理（RHSB-2026-012）が明快:

1. システムのトラストストア（`ca-certificates` 等）が、当該 eMudhra 中間CA を信頼している
2. 攻撃者が侵害された秘密鍵のいずれかを保持している
3. 攻撃者が TLS 接続を傍受できるネットワーク位置にいる

**「侵害された」＝「自分のシステムが侵害された」ではない。** 条件が揃わなければ実害は無い。
ただし条件1は、更新しない限り誰でも満たしてしまう。

## 3. エコシステムの対応

| 主体 | 対応 |
|---|---|
| Chrome / Android | 該当証明書の信頼を停止 |
| Firefox（Mozilla） | 同様に信頼停止。Red Hat は Mozilla の迅速な公開を評価している |
| Go | `crypto/x509` に**拒否リスト**を追加し、`Verify` 時にエラーを返す（**CVE-2026-111943**） |
| Node.js | 10月のセキュリティリリースに **ca-cert の更新**を同梱（22.23.4 / 24.22.1 / 26.12.1） |
| Red Hat | `ca-certificates` パッケージの更新を全 TLS 利用者に推奨 |

## 4. 何を更新すれば足りるか

| 層 | 対応 |
|---|---|
| OS のトラストストア | `ca-certificates` を更新（Debian/Ubuntu: `apt install --only-upgrade ca-certificates`、Arch: `pacman -Syu ca-certificates`、RHEL: `dnf upgrade ca-certificates`） |
| ランタイム同梱のバンドル | Node.js / Go / Python（`certifi`）/ Java（cacerts）など、**自前でバンドルを持つもの**はランタイム側を更新 |
| アプリ独自のピン留め | 個別確認。eMudhra の中間CA を明示的に信頼している設定があれば削除する |

**やらなくてよいこと**: アプリケーションコードの変更、TLS 設定の変更、証明書の再発行
（自分のサーバ証明書が eMudhra 発行でなければ）。ただし**自組織の証明書が eMudhra 系で
発行されている場合は、CA 側の対応状況を確認する**こと。

## 5. 検出・確認のしかた

```bash
# システムのトラストストアに eMudhra 系が残っていないか
trust list 2>/dev/null | grep -i -A3 emudhra   # p11-kit がある場合
grep -ril emudhra /etc/ssl/certs/ 2>/dev/null | head
openssl version -d                             # 使っているバンドルの場所

# Node が使うバンドル
node -e 'console.log(process.versions.openssl)'   # 版が上がっているか
```

「怪しい証明書を見つける」作業ではなく、**「信頼してはいけないものを信頼し続けていないか」**
を確認する作業。CT ログの監視をしているなら、eMudhra 発行の証明書が自ドメインに出ていないか
を見るのが実務的。

## 6. 出所

- Red Hat RHSB-2026-012: <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012>
- NVD（Go 側の追跡ID）: <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111943>
- Node.js 10月勧告（ca-cert 更新の記載）: <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases>
- Mozilla Security Blog: eMudhra 中間CA 侵害後の Firefox 利用者保護（Red Hat の参照先）
