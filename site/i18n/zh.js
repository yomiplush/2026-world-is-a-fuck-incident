/* 简体中文 — generated for the briefing. Technical facts (CVE ids, versions,
   product names, commands) are identical to the English source; only the prose
   is translated. */
window.registerLocale("zh", {
  ui: {
    chapter: "简报", sound: "声音", on: "开", off: "关",
    sources: "来源", close: "关闭", tap: "下一则", replay: "重新开始",
    hint: "点按 / 点击 / 空格",
    hintEnd: "已到最后。点按回到开头",
    coverKicker: "事件简报 · 2026-10",
    coverTitleA: "一个月，", coverTitleB: "15 起事件。",
    coverSub: "2026 年 10 月的 15 起事件，按时间顺序。<br>补充 Apache，以及 10-23 的八段后记。点按前进，有声音。<br>10-24 新增八页（英语）。<br>10/25: +6 scenes (English).",
    coverStart: "点按开始",
    coverFoot: "10/25: ConnectWise primary sources verified. Earlier scenes are historical.",
    drawerTitle: "来源 / SOURCES",
    drawerFoot: "10/25 sources supersede earlier ConnectWise uncertainty; retrieved after cutoff.",
    asof: "2026-10-25 16:34 JST"
  },
  scenes: {
    intro: {
      title: "一个月，15 起事件。",
      lede: "看似无关的事故，却反复落在同一类弱点上。按时间顺序点按前进。",
      points: [
        "15 起中有 <b>8 起</b>是 npm / pip / 插件 / 发布产物的问题——问题在<em>分发</em>，不在代码",
        "ConnectWise now has primary confirmation; see the 10/25 addendum (English).",
        "有声音，可在右上角关闭"
      ],
      metric: "事件 · 一个月"
    },
    "php-silence": {
      title: "安静的七十天。",
      lede: "从报告到发布共七十天。危险的不是公开之后，而是公开之前。",
      points: [
        "08-01 Calif 发现多条 RCE 路径 / 08-11 报告给 PHP",
        "10-20 细节泄露，watchTowr 确认 RCE",
        "10-21 <b>07:43 UTC</b> 修复发布前已观测到攻击尝试（Cloudflare）",
        "10-21 14:00 修复版本——8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
      ],
      metric: "从报告到公开的天数"
    },
    zeabur: {
      title: "一把明文管理员密钥打开了九个区域。",
      lede: "八月之后的第二次。八月的轮换并未覆盖这次被使用的凭证。",
      points: [
        "10-14 01:36 用内部 AWS 密钥进入 / 01:51 读到系统密钥",
        "12:39 起扩展到全部服务的环境变量；在 <b>865</b> 个数据库服务中执行了命令",
        "根因：明文、无期限的管理员凭证，以及可从公网访问的管理面板",
        "用户应轮换全部环境变量（即使八月已做过）"
      ],
      metric: "受影响的数据库服务"
    },
    rankmath: {
      title: "有十一小时，官方下载包是有毒的。",
      lede: "插件的更新通道就是攻击路径。CVSS 9.8。",
      points: [
        "10-15 20:02 至 10-16 07:12 UTC 之间下载的 <b>3.0.123</b>",
        "<b>CVE-2026-111862</b> / CVSS 9.8 / 3.0.124 修复",
        "升级不等于修复——需排查管理员账号、额外文件与计划任务",
        "Wordfence 提前发布了紧急防火墙规则"
      ],
      metric: "CVSS · CVE-2026-111862"
    },
    teamupdraft: {
      title: "数据库里的密钥，是数千个网站的入口。",
      lede: "连接密钥可作为「合法签名的命令」使用，因此既有的安全修复拦不住它。",
      points: [
        "客户数据库被读取：联系方式、哈希密码、两步验证设置、<b>三类连接密钥</b>",
        "UpdraftCentral / UpdraftVault / UpdraftClone 的密钥被用于植入恶意插件",
        "签名是真实的，所以已修复 CVE-2026-10795 的站点仍会接受",
        "UpdraftPlus 1.26.13 / 2.26.13 会自动断开 10-18 22:00 BST 之前的连接"
      ],
      metric: "被滥用的密钥种类"
    },
    emudhra: {
      title: "密钥不是被偷的，是太弱了。",
      lede: "P-384 私钥竟然是小整数——其中一把字面上就是 4，从公开证书一秒内即可还原。",
      points: [
        "<b>八把</b>中间 CA（六把 TLS、两把代码签名），2025 年 4 月的密钥生成仪式",
        "10-17 18:05 UTC 报告 → 19:45 Chrome 按 SPKI 哈希阻断 → 22:59 覆盖全部 Firefox",
        "CT 只覆盖 TLS；「CT 里没有」并不能为两把代码签名 CA 开脱",
        "10-21 Tailscale <b>TS-2026-013</b>：v1.104.2 引入 Go 1.27.3 的拒绝清单"
      ],
      metric: "一把字面上的私钥"
    },
    ovh: {
      title: "有 94 分钟，官方二进制是别的东西。",
      lede: "源码和构建链都没事。被打破的是「发布产物不可替换」这个前提。",
      points: [
        "10-19 14:47–16:21（UTC+2）发布产物被替换",
        "涉及 <b>v0.11.0–v0.15.0</b>；仅该时间段内的下载受影响",
        "根因：仓库未启用发布不可变性（release immutability）",
        "修复是一个设置加一项验证：不可变发布＋签名校验"
      ],
      metric: "暴露时长（分钟）"
    },
    oracle: {
      title: "55 个修复，最高 7.5——而陷阱在版本列。",
      lede: "「受影响版本」和「修复版本」是两列。21.0.12.1 是受影响版本，修复是 21.0.13。",
      points: [
        "55 个 CVE / 49 个可远程无认证利用 / 最高 CVSS 7.5 / KEV 中为零",
        "受影响：8u503, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1, 26.0.2, 27",
        "10-20 修复：<b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
        "JDK 26 没有修复（不存在 26.0.3）——只能迁移到 27"
      ],
      metric: "CVE · 49 个可无认证远程利用"
    },
    plex: {
      title: "一个 4.3 的 SSRF，就是代码执行的前门。",
      lede: "单看分数都不高。CISA 的 KEV 却说这四条可以串起来。",
      points: [
        "10-20 加入 KEV / 96656 与 96654 的期限是 <b>10-23</b>",
        "链路：任意 X-Plex-Token → SSRF → 调用插件 → 管理员写文件 → 启动时执行 .so",
        "96651 不在 KEV，但它会读取 <b>PlexOnlineToken</b>——即账号接管",
        "修复版 <b>1.43.3.10861</b>，当前版本已是 <b>1.43.5.11029</b>；NAS 商店更新滞后"
      ],
      metric: "KEV 中的 CVE · 期限 10-23"
    },
    apache: {
      title: "三个“Important”，同一个结果：别人的数据。",
      lede: "Tomcat 的三条机制不同、结果相同。httpd 的“low”被打了 7.5。严重性不是一个数字。",
      points: [
        "Tomcat：JNDIRealm（非 GSSAPI SASL）认证绕过，加上 HTTP/2 与 AJP 响应混线——<b>11.0.27 / 10.1.61 / 9.0.123</b>",
        "httpd <b>2.4.69</b>：mod_rewrite 的 UAF 与 mod_proxy_html 的越界写。Apache 标 low，NVD 给了 7.5",
        "Traffic Server：两起请求走私（8.9 / 8.7）",
        "KEV 中为零——没有公开的利用，不等于安全"
      ],
      metric: "Tomcat 认证绕过 · CVSS 4.0"
    },
    "php-race": {
      title: "修复前六小时，试探就已经来了。",
      lede: "这类漏洞等公开 PoC 就等于太晚。Node.js 也在同一天发了版本。",
      points: [
        "<b>07:43 UTC</b> Cloudflare 观测到修复发布前的攻击尝试",
        "<b>14:00</b> PHP 发布修复 / <b>14:17</b> NVD 公开 CVE",
        "同一天：Node.js 22.23.4 / 24.22.1 / 26.12.1（含 CA 证书更新）",
        "那 24 小时内暴露过的实例，需另行确认是否被入侵"
      ],
      metric: "修复前的试探间隔"
    },
    gitlab: {
      title: "上周打过补丁，也不等于已在修复版上。",
      lede: "10 月 12 日的更新只覆盖 19.2 及以后；这次的修复版本比它再高一个。",
      points: [
        "<b>CVE-2026-110264</b> / Onigmo 整数溢出 / 未认证 RCE / 7.0（2014）以来全部版本",
        "修复：19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
        "10 月 12 日更新过、但仍低于 19.2.9 的实例再次受影响",
        "没有公开的规避方案——无法升级就切断公网可达性"
      ],
      metric: "CVSS · 未认证"
    },
    npm: {
      title: "分发渠道本身成了攻击面。",
      lede: "10 月的 8 起都与代码如何被交付有关。provenance 只说明在哪构建。",
      points: [
        "LiteLLM 1.107.0：Python 一启动就窃取，构建自仿冒仓库 <b>Berri-AI</b>",
        "tensorlake@0.5.144：撤销令牌就删除 <b>$HOME</b> 的「人质令牌」",
        "@subql/common@5.8.3：安装时与 import 时都会执行",
        "GhostAction：伪造的 security-audit.yml 从 <b>345</b> 个仓库外送密钥与 git 历史"
      ],
      metric: "16 分钟内被扫过的仓库"
    },
    railway: {
      title: "环境变量，本来就是秘密的存放处。",
      lede: "「针对平台公司、意在 AI 推理服务商的一系列攻击之一」——厂商自己这样写。",
      points: [
        "客户环境变量被以加密形式读取，其中部分可能已被解密",
        "调查期间暂停全部部署，并请求上游服务商先行吊销密钥",
        "该做的不是「可能泄露的那把」，而是<b>全部</b>轮换",
        "SMTP 密码、webhook 签名密钥、JWT_SECRET 也都在环境变量里"
      ],
      metric: "需要轮换的环境变量"
    },
    bind: {
      title: "一个被重放的报文，就能破坏内存。",
      lede: "重放带 GSS-TSIG 签名的 UDP 报文会破坏 named 的内存。ISC 明确表示没有规避方案。",
      points: [
          "<b>CVE-2026-94300</b> / CVSS 8.1（AV:N、AC:H）/ ISC 严重度 <b>High</b> / 可远程利用",
          "受影响 9.11.0–9.18.50、9.20.0–9.20.29、9.21.0–9.21.26（含 S1）→ 修复 <b>9.20.30 / 9.21.27</b>",
          "入口是 GSS-TSIG 处理器：用 `named-checkconf -p | grep -i gssapi` 确认是否启用",
          "没有规避方案。EOL 分支（9.11–9.18）只能迁移到 9.20 / 9.21"
      ],
      metric: "CVSS · 无规避方案"
    },
    lkml: {
      title: "六个 0day 被发到了公开列表。",
      lede: "ZDI 把报告发到了公开的 LKML，而不是私有的 security 列表；Greg Kroah-Hartman 逐条回复询问原因。",
      points: [
          "SMB Direct 整数下溢（<b>9.0</b>）与 ksmbd 竞态（<b>9.0</b>）——都是远程代码执行",
          "skb_zerocopy 的本地提权、vmwgfx 越界写、nvmet 未初始化、TCP 查询栈溢出",
          "主线<b>尚未修复</b>：补丁在 v7.5 分支与 -next（10-22），主线无提交引用这些 ZDI 编号",
          "降低暴露：不用的 <b>ksmbd</b> 停掉；不要把 SMB Direct 暴露给不可信网络"
      ],
      metric: "公开提交的报告数"
    },

    sweep: {
      title: "两周内 124 个 CRITICAL，只有 1 个被利用。",
      lede: "这个数字衡量的是披露的批量，不是风险。最高 CVSS 里也含着他人的假设。",
      points: [
        "124 个中 <b>58%</b> 是 Oracle 的季度批次与消费级 IoT 固件（今天新增 4 个，其中 3 个是 2021/2022 年的 CVE）",
        "只有 <b>26%</b> 有 NVD 的 CPE 映射，按厂商统计只能看到四分之一",
        "最高 EPSS 为 3.0%；在 KEV 里的 Plex 漏洞只有 <b>0.76%</b>——太新，用不上",
        "CNA 与 NVD 会不一致：MOVEit 与 TeamCity 厂商给 8.1（AC:H），NVD 给 9.8（AC:L）"
      ],
      metric: "CRITICAL 数 : 已知被利用数"
    },
    closing: {
      title: "风险不在你写的代码里。",
      lede: "十月坏掉的是「决定哪段代码会运行」的那层信任。有效的控制很枯燥，多数是配置。",
      points: [
        "发布的不可变性与安装时的签名校验",
        "用哈希锁定版本；不要用 `latest`；对比 git tag 的差异",
        "不要存放明文、长期有效的管理员凭证；管理面板不要暴露",
        "把厂商数据库当成持有你的密钥（TeamUpdraft / Railway / Zeabur）"
      ]
    }
  }
});
