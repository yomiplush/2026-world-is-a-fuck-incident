/* Stored translations; missing scenes filled by Google Cloud Translation. */
window.registerLocale("ko",{
  "ui": {
    "chapter": "BRIEFING",
    "sound": "소리",
    "on": "ON",
    "off": "OFF",
    "sources": "원천",
    "close": "닫다",
    "tap": "다음",
    "replay": "처음부터",
    "hint": "탭/클릭/스페이스",
    "hintEnd": "이게 마지막입니다. 탭하면 처음으로 돌아갑니다.",
    "coverKicker": "INCIDENT BRIEFING · 2026-10",
    "coverTitleA": "한 달 안에,",
    "coverTitleB": "15 항목.",
    "coverSub": "다음은 2026 의 10 월에 중복되는 15 인스턴스 목록이며, 시간 순서대로 나열되어 있습니다.<br>Apache 커널 및 10 - 23 에 대한 추가 사항 외에도, 10 - 24 에 대한 광역 조사, 10 - 25 에 대한 보충 내용, Tailworm 6 화면 및 10 - 26 아침 4 화면에 대한 특별 기능이 포함되어 있습니다. 모든 65 화면은 시간 순서대로 표시됩니다. 00:18 에는 야간 계정 확인 및 복구 상태/Brotli 도착 정보가 추가되었습니다. 07:47 에는 Consul/샌드박스 대응책이, 18:47 에는 확인 상태/배송/MPC/패키지 대응책이 추가되었습니다. 광역 조사에 대한 자세한 내용은 보고서를 참조하십시오. 탭하여 진행하세요. 소리가 재생됩니다.",
    "coverStart": "TAP TO BEGIN",
    "coverFoot": "출처가 포함되어 있습니다. ConnectWise는 10/25 조사 과정을 통해 처음으로 검증되었습니다. 이전 장면들은 당시 기록을 기반으로 합니다.",
    "drawerTitle": "출처",
    "drawerFoot": "최신 보고서는 10/27 07:47 표준을 기반으로 합니다. 화면에는 각 날짜별 기록이 표시되며, 추가 자료는 확인 날짜 순으로 나열됩니다. 실제 자료 수집은 표준이 수립된 후에 이루어집니다.",
    "asof": "2026 - 10 - 27 07:47 JST 표준",
    "lang": "JA"
  },
  "scenes": {
    "intro": {
      "kicker": "INCIDENT BRIEFING · 2026-10",
      "title": "10 월의 사안을, 시계열로.",
      "lede": "서로 무관하게 보이는 사안이 같은 종류의 약점에 모인 달. 탭하여 시계열로 이동합니다.",
      "points": [
        "초기 조사 15 건과 그 후의 광역 추보. 건수는 전 세계 피해 총수가 아니다",
        "<a href=\"./update-20261027-0747.html\">10 / 27 07:47 최신 조사 →</a> · <a href=\"./timeline.html\">날짜에서 읽기 →</a>",
        "소리가 나옵니다. 오른쪽 상단의 SOUND에서 지울 수 있습니다."
      ],
      "metric": "incidents · 1 month"
    },
    "php-silence": {
      "kicker": "PHP CORE · COORDINATED DISCLOSURE",
      "title": "70 일 동안 조용했습니다.",
      "lede": "발견부터 공개까지 70 일. 위험했던 것은 공개 후 24 시간이 아니라 공개 직전.",
      "points": [
        "08 - 01 Calif가 여러 RCE 경로 발견 / 08 - 11 PHP에보고",
        "10 - 20 세부 사항이 유출되고 watchTowr이 RCE를 확인합니다.",
        "10-21 <b>07:43 UTC</b> 수정 공개 전에 공격 시도 관측(Cloudflare)",
        "10 - 21 14:00 수정판 — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
      ],
      "metric": "days from report to public"
    },
    "zeabur": {
      "kicker": "ZEABUR · INFRASTRUCTURE",
      "title": "평문의 관리자 키가 9 리전을 열었다.",
      "lede": "8 월 다음에 2 번째. 로테이션은 '이번에 사용된 열쇠'를 커버하지 않았다.",
      "points": [
        "10 - 14 01:36 내부 AWS 키로 침입 / 01:51 에 시스템 비밀",
        "12:39 에서 모든 서비스의 환경 변수로 확장,<b>865</b> DB 서비스에서 명령 실행",
        "원인은 평문·무기한의 관리자 자격 정보와 공개된 관리 화면",
        "사용자는 모든 환경 변수를 회전합니다 8"
      ],
      "metric": "database services touched"
    },
    "rankmath": {
      "kicker": "RANK MATH SEO PRO · PLUGIN CHANNEL",
      "title": "11 시간만 공식 배포물이 오염되었습니다.",
      "lede": "플러그인의 갱신 경로는 그대로 공격 경로가 된다. CVSS는 9.8 .",
      "points": [
        "10 - 15 20:02 → 10 - 16 07:12 UTC에 취득했습니다. <b>3.0.123</b>",
        "<b>CVE-2026-111862</b> / CVSS 9.8 / 수정은 3.0.124",
        "업데이트가 해결되지 않음 — 관리자 계정, 추가 파일, 정기 작업 찾기",
        "Wordfence는 긴급 방화벽 규칙을 앞당겨 배포"
      ],
      "metric": "CVSS · CVE-2026-111862"
    },
    "teamupdraft": {
      "kicker": "TEAMUPDRAFT · CONNECTION KEYS",
      "title": "DB에 있던 열쇠가 수천 사이트의 입구였다.",
      "lede": "접속 키는 「서명 첨부의 정규 커멘드」로서 사용할 수 있다. 그래서 기존의 수정으로는 멈추지 않는다.",
      "points": [
        "고객 DB 읽기: 연락처, 해시 암호, 2 FA 설정,<b>연결 키 3 종</b>",
        "UpdraftCentral / UpdraftVault / UpdraftClone 키로 악성 플러그인 켜기",
        "서명이 진짜이므로 CVE-2026-10795 적용된 경우에도 접수되었습니다.",
        "UpdraftPlus 1.26.13 / 2.26.13 10 - 18 22:00 BST 이전 연결 자동 연결 끊기"
      ],
      "metric": "key types abused"
    },
    "emudhra": {
      "kicker": "EMUDHRA · CERTIFICATE AUTHORITY",
      "title": "열쇠는 도난당하지 않았다. 너무 약했다.",
      "lede": "P-__ 384 의 비밀 키가 작은 정수였다. 적용된 것은 \" 4 , 56 , 66 , 115 , 155 , 156 , 230 , 237 \". 3 ~ 8 비트밖에 없다.",
      "points": [
        "중간 CA <b>8 책</b>(TLS 6 + 코드 서명 2 ). 2025 - 04 - 30 의 키 생성 <b>24 책</b>의 하위 CA를 만들 때, wrap/unwrap의 버그가 「약한 열쇠의 2 세트째」를 낳았다",
        "10 - 17 18:05 UTC 보고서 → 19:45 Chrome이 SPKI에서 차단 → 22:59 Firefox 전대. **Apple은 TLS 6 책, Microsoft는 코드 서명 2 책**을 차단",
        "브라우저는 자신의 분을 정리했을 뿐. 남는 것은 Docker·Kubernetes·IoT·Python 동봉 루트——Go 는 <b>CVE-2026-111943</b> 로 1.27.3 / 1.26.10 에서 거부",
        "최근에 날카로운 것은 <b>VPN 클라이언트</b>(Talos/Ars). &quot;Heartbleed보다 큰 후 정리&quot;와 Go의 암호 담당"
      ],
      "metric": "one private key, literally"
    },
    "ovh": {
      "kicker": "OVHCLOUD CLI · RELEASE ASSETS",
      "title": "94 분 동안 공식 바이너리는 별개였다.",
      "lede": "소스도 빌드도 무사. 부서진 것은 \"릴리스 자산을 바꿀 수 없다\"는 전제.",
      "points": [
        "10 - 19 14:47 ~ 16:21 (UTC+ 2 )로 자산 교환",
        "대상은 <b>v0.11.0〜v0.15.0</b>, 영향은 그 시간대의 취득만",
        "원인: 리포지토리가 릴리스의 불변성(immutability)을 보증하지 않았다",
        "대책은 설정 하나: 불변 릴리스＋서명 검증"
      ],
      "metric": "minutes of exposure"
    },
    "oracle": {
      "kicker": "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
      "title": "55 건. 최대는 7.5 . 귀찮은 것은 판.",
      "lede": "「영향을 받는 판」과 「수정판」은 다른 열. 21.0.12.1 은 영향 버전이며 수정은 21.0.13 .",
      "points": [
        "55 건 / 인증 불필요하고 원격 49 건 / 최대 CVSS 7.5 / KEV 0 건",
        "영향: 8 u 503 , 11.0.32.1 , 17.0.20.1 , 21.0.12.1 , 25.0.4.1 , 26.0.2 , 27",
        "수정 ( 10 - 20 ): <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
        "JDK 26 에 수정 없음 ( 26.0.3 은 존재하지 않음) → 27 로"
      ],
      "metric": "CVEs · 49 remote, no auth"
    },
    "plex": {
      "kicker": "PLEX MEDIA SERVER · KEV",
      "title": "4.3 의 SSRF가 코드 실행 입구가됩니다.",
      "lede": "개별 점수는 평범. CISA의 KEV는 4 건이 체인한다고 명시한다.",
      "points": [
        "KEV 추가 10 - 20 / 마감 <b>10-23</b>( 96656 및 96654 )",
        "체인: 모든 X-Plex-Token → SSRF → 플러그인 호출 → 관리 쓰기 → 시작 시 .so 실행",
        "96651 은 KEV 외부이지만 <b>PlexOnlineToken</b> 읽기 = 계정 장악",
        "수정 <b>1.43.3.10861</b>, 최신은 <b>1.43.5.11029</b>( 2026 - 10 - 23 10:36 JST 시점). NAS 패키지가 지연됨"
      ],
      "metric": "CVEs in KEV · due 10-23"
    },
    "apache": {
      "kicker": "ADDENDUM · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
      "title": "'Important'의 내용은 이용자 간의 혼선이었다.",
      "lede": "Tomcat의 3 건은 구조가 달라 결말이 같다. httpd의 \"low\"는 7.5 . 심각도는 1 개의 숫자가 아니다.",
      "points": [
        "Tomcat : 인증 바이 패스 (JNDIRealm 비 GSSAPI SASL) + HTTP / 2 / AJP 응답 혼선 - <b>11.0.27 / 10.1.61 / 9.0.123</b>",
        "httpd <b>2.4.69</b>: mod_rewrite 의 UAF 와 mod_proxy_html 의 범위외 기입. Apache는 low, NVD는 7.5",
        "Traffic Server: 요청 스매그링 2 건( 8.9 / 8.7 )",
        "KEV는 0 건. 다만 「미공개」=안전하지 않다"
      ],
      "metric": "Tomcat · auth bypass (CVSS 4.0)"
    },
    "php-race": {
      "kicker": "PHP · THE SIX-HOUR GAP",
      "title": "수정 6 시간 전에 시도가 왔다.",
      "lede": "\"PoC가 나오고 당황하다\"에서는 늦지 않는 종류의 취약성. 같은 날 Node.js도 움직였다.",
      "points": [
        "<b>07:43 UTC</b> Cloudflare가 수정 게시 전의 공격 시도를 관찰",
        "<b>14:00</b> PHP, 수정판 공개 / <b>14:17</b> NVD, CVE 공개",
        "같은 날 : Node.js 22.23.4 / 24.22.1 / 26.12.1 (CA 번들 업데이트 포함)",
        "공개의 24 시간, 노출하고 있던 구성은 침해 유무를 별도 확인한다"
      ],
      "metric": "probes before the fix"
    },
    "gitlab": {
      "kicker": "GITLAB · CVSS 10.0",
      "title": "지난주 패치를 맞고 있어도 해당한다.",
      "lede": "10 월 12 일 업데이트는 19.2 이후에만. 이번 수정판은 그 1 이상.",
      "points": [
        "<b>CVE-2026-110264</b> / Onigmo 정수 오버플로 / 인증되지 않은 RCE / 7.0 ( 2014 ) 이후 모두",
        "수정 : 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
        "10 월 12 일에 패치한 환경도 19.2.9 미만이라면 다시 해당(수정판은 그 1 상)",
        "공개된 회피책은 없다. 낮추면 도달성을 끕니다."
      ],
      "metric": "CVSS · unauthenticated"
    },
    "npm": {
      "kicker": "PACKAGE CHANNELS · FOUR INCIDENTS",
      "title": "배포물 자체가 공격면이 되었다.",
      "lede": "10 월의 8 건은 코드 배포 문제입니다. provenance는 \"어디에서 만들어졌는가\"밖에 말하지 않는다.",
      "points": [
        "LiteLLM 1.107.0 : 시동시 절취. 똑같이 리포지토리 <b>Berri-AI</b> 에서 빌드",
        "tensorlake@ 0.5.144 : 해지되면 <b>$HOME</b> 지우는 &quot;인질 토큰&quot;",
        "@subql/common@ 5.8.3 : 설치 및 가져 오기 모두 시작",
        "GhostAction : 가짜 security-audit.yml <b>345</b> 리포지토리의 비밀과 기록 내보내기"
      ],
      "metric": "repos swept · 16 minutes"
    },
    "railway": {
      "kicker": "RAILWAY · ENVIRONMENT VARIABLES",
      "title": "환경 변수는, 비밀의 두는 장소였다.",
      "lede": "\"AI 추론 제공자를 노리는 일련의 공격의 일부\"--벤더 자신이 그렇게 썼다.",
      "points": [
        "고객의 환경 변수가 암호화된 상태로 읽혀지고 일부가 해독되었을 가능성",
        "조사 중에는 모든 배포를 중지하고 상류 공급자에게 열쇠 선제 해지를 요청하십시오.",
        "필요한 것은 &quot;누출되었을 수있는 열쇠&quot;가 아니라<b>모두</b>로테이트",
        "SMTP 암호, webhook 서명 비밀, JWT_SECRET도 환경 변수에 있습니다."
      ],
      "metric": "env vars to rotate"
    },
    "bind": {
      "kicker": "ADDENDUM · ISC BIND 9 / DNS",
      "title": "재전송된 1 패킷이 메모리를 손상시킨다.",
      "lede": "GSS-TSIG로 서명 된 UDP를 재생하면 named가 손상됩니다. ISC는 \"해결 방법 없음\"이라고 명시했다.",
      "points": [
        "<b>CVE-2026-94300</b> / CVSS 8.1 (AV:N·AC:H)/ 심각도 <b>High</b> / 원격에서",
        "영향: 9.11.0 – 9.18.50 , 9.20.0 – 9.20.29 , 9.21.0 – 9.21.26 (S 1 시스템도) → 수정 <b>9.20.30 / 9.21.27</b>",
        "입구는 GSS-TSIG 핸들러. `named-checkconf -p | grep -i gssapi`로 설정의 유무를 확인",
        "해결 방법은 없다. EOL 브랜치( 9.11 ~ 9.18 )는 9.20 / 9.21 로 옮길 수밖에 없다"
      ],
      "metric": "CVSS · 해결 방법 없음"
    },
    "lkml": {
      "kicker": "ADDENDUM · LINUX KERNEL / LKML",
      "title": "공개 목록에 0 day가 6 건 흘렀다.",
      "lede": "ZDI는 비공개 보안 목록이 아닌 공개 LKML에 게시합니다. Greg Kroah-Hartman이 각 사례에 회신했습니다.",
      "points": [
        "SMB Direct 정수 언더플로(<b>9.0</b>)와 ksmbd의 충돌 (<b>9.0</b>)——모두 원격 RCE",
        "skb_zerocopy LPE, vmwgfx 범위 밖 쓰기, nvmet 초기화, TCP 쿼리 스택 넘치기",
        "메인 라인은<b>수정되지 않음</b>. v7.5 브랜치와 -next 패치( 10 - 22 시점). ZDI ID를 참조하는 mainline 커밋 없음",
        "노출 감소: 사용하지 않음 <b>ksmbd</b> 중지 / SMB Direct를 untrusted에 노출시키지 않음"
      ],
      "metric": "reports sent public"
    },
    "sweep": {
      "kicker": "THE SWEEP · NVD, 14 DAYS",
      "title": "같은 명령으로 125 → 104 . 세상은 변하지 않았다.",
      "lede": "창은 \"오늘\"로 끝난다. 그래서 숫자는 시계와 함께 움직입니다. 건수는 위험이 아니라 공개와 해석의 정리 방법을 측정하고 있다.",
      "points": [
        "9 시간 전은 125 건, 지금은 104 건. 내역은 <b>- 17 (창의 끝) - 4 (CRITICAL에서 이탈) + 0 (신규)</b>",
        "NVD CPE 연결은 <b>26%</b>. 최근 24 시간에 공개된 381 건은 <b>0%</b>(해석이 아직)",
        "EPSS 최고는 <b>5.76%</b> — php 2 shell의 109619 . 그러나 8.1 로 떨어지고 CRITICAL 외부",
        "CNA와 NVD에서 점수가 깨집니다. MOVEit / TeamCity는 8.1 (AC:H) 및 9.8 (AC:L)"
      ],
      "metric": "critical CVEs : known exploited"
    },
    "closing": {
      "kicker": "WHAT IT MEANS",
      "title": "위험은 작성한 코드가 아닙니다.",
      "lede": "10 월에 망가진 것은 「무슨 코드가 움직일 것인가를 결정하는 신뢰」의 측. 효과적인 통제는 수수하고 대부분이 설정입니다.",
      "points": [
        "릴리스 불변성 및 설치 시 서명 확인",
        "해시가있는 판 고정. `latest`를 사용하지 않는다. git 태그와의 차이점 보기",
        "평문·장기의 관리자 자격 정보를 두지 않는다. 관리 시스템은 공개하지 않습니다.",
        "벤더의 DB는 자신의 열쇠를 보유하고 있다고 생각한다 (TeamUpdraft / Railway / Zeabur)",
        "커널은 「어플마다 고칠 수 없는 경계」. 컨테이너 내의 코드 실행은 호스트에서 루트 입구"
      ]
    },
    "infinity-core": {
      "kicker": "POSTSCRIPT · LINUX KERNEL",
      "title": "커널의 핵심에 root에의 지름길이 6 책.",
      "lede": "Hyunwoo Kim이 oss-security에 공개한 'Infinity Core'. 5 건으로 비특권에서 root, 같은 5 건으로 컨테이너에서 호스트로 빠진다.",
      "points": [
        "timer/signal/mm/futex/scheduler/SLAB. 네트워크도 BPF도 user namespace도 사용하지 않음",
        "NVD는 4 <b>7.8</b>, 2 건은 점수 없음. 6 건 모두 분석 전 (<code>Received</code>)에서 KEV에는 없습니다.",
        "<b>수정이 이미 나왔다.</b>. 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8 , 스케줄러는 7.2.9 . 현재 stable이 모두 초과됨",
        "효과는<b>재부팅</b>. 넣은 것만으로 오래된 커널로 움직이면 열린 채로"
      ],
      "metric": "CVE : 루트 취득 PoC"
    },
    "blindspot": {
      "kicker": "POSTSCRIPT · THE BLIND SPOT",
      "title": "스윕은 데이터베이스 작업 만보고 있습니다.",
      "lede": "공개일로 당기거나 갱신일로 당겨도 12 개의 피드를 읽어도 Infinity Core는 나오지 않았다.",
      "points": [
        "CVE 게시일은 <b>9/4〜10/12</b>. PoC가 나온 것은 <b>10/16</b> — 6 주간 편차",
        "NVD 레코드는 6 시간 업데이트 스윕에서 작동하지 않습니다. 6 건 모두 <code>Received</code>",
        "피드 13 개의 제목에 <code>infinity</code> 는 <b>0 건</b>. RSS도 창문이며 기록은 아카이브 쪽",
        "더한 축은<b>공개 채널</b>。<code>oss-sec</code> 를 더한 시간에 다른 12 책이 떨어진 4 건이 데리러"
      ],
      "metric": "이 6 건을 보도한 피드"
    },
    "ecosystem": {
      "kicker": "POSTSCRIPT · THE ECOSYSTEM",
      "title": "CVE가 되지 않은 critical 이 2 건 있었다.",
      "lede": "GitHub Advisory Database 24 시간. Next.js의 인증되지 않은 RCE 2 에는 아직 CVE가 없습니다.",
      "points": [
        "Next.js의 <code>use cache</code> 및 이미지 최적화 (SVG)의 인증되지 않은 RCE. 수정은 <b>16.4.1</b> / <b>15.5.28</b>",
        "DOMPurify 3.4.17、Pillow 13.0.0、GitPython 3.2.1、<code>toml</code> 5.0.1、Storybook 8.6.19",
        "CVE로 좁히는 과정에서이 2 은 끝까지 보이지 않습니다. 판단은 패키지명과 수정판에서",
        "같은 날에 Python CA 번들도 버전 번호가 나왔다 : <code>certifi</code> 2026.10.19 / <code>pip</code> 26.2.2"
      ],
      "metric": "24 시간 패키지 추천"
    },
    "node2shell": {
      "kicker": "POSTSCRIPT · NODE.JS",
      "title": "공식 빌드에서 움직였다.",
      "lede": "Imperva가 배포 된 Node.js 24.22.0 의 이미지에서 조작 된 Brotli 데이터에서 코드 실행에 성공했습니다. 디버거도 측정 빌드도 필요하지 않습니다.",
      "points": [
        "입구는 2 개.<code>fetch()</code> 신뢰할 수없는 Brotli 응답을 소비하는 경로와 Express 5 / body-parser 2 가 요청 본문을 배포하는 경로. 기본 <code>http.createServer()</code> 자동으로 배포하지 않습니다.",
        "검증은 24.22.0 Linux arm 64 의 1 빌드. 22 .x / 26 .x와 다른 아키텍처는 검증되지 않았으며 성공까지 여러 번 시도했습니다.",
        "같은 입력은 <b>24.22.1</b> 거부한다. 실제 환경의 악용 보고는 아직 없다",
        "NVD 레코드는 CVSS 4.0 <b>9.2</b> 그냥 3.1 이 없습니다. 심각도로 좁힌 CRITICAL 목록에는 나오지 않는다"
      ],
      "metric": "움직인 판 : 거부한 판은 24.22.1"
    },
    "prepatch": {
      "kicker": "POSTSCRIPT · PHP2SHELL",
      "title": "권고의 4 일 전에 시도가 시작되었습니다.",
      "lede": "AWS 허니팟에는 2026 - 10 - 17 의 악용 시도가 남았고 공개 PoC는 엔버고 해제 12 시간 전부터 나왔습니다. 공개일은 첫 번째 공격일이 아닙니다.",
      "points": [
        "수정 전 24 시간에 <b>482,342</b> 요청 / 122 , 311 세션 / 21 , 998 사이트 / 103 국가 (Imperva 관측)",
        "그러나<b>시도</b>그리고 침해가 아니다. Sophos는 Mirai 파생 설치에 실패했다고 Dataminr은 알려진 침해 제로",
        "KEV는 여전히 미수재. EPSS는 5.31 % / 5.76 %",
        "조사의 기점은 <b>10-17</b>. 공개일부터 시작하면 첫 4 일이 종료됩니다."
      ],
      "metric": "첫 시도 → 권고"
    },
    "filters": {
      "kicker": "POSTSCRIPT · THE FILTER",
      "title": "9.9 에서도 목록에 나타나지 않습니다.",
      "lede": "NVD 심각도 필터는 자신의 CVSS 3 .x 만 계산합니다. CNA가 붙은 9.9 은 같은 레코드에 있어도 0 개의 대답이 됩니다.",
      "points": [
        "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> 는 <b>0 건</b>. 레코드에는 9.9 (Secondary)가 있습니다.",
        "같은 이유로 악용 중 <code>CVE-2026-111497</code>(CVSS 4.0 전용 9.2 ) 및 <code>CVE-2026-114625</code>(CNA 9.9 )도 목록에 나오지 않습니다.",
        "10 시간에 <b>104 → 98</b>. 6 건이 나오고 0 건이 들어가고 고쳐지지는 않습니다.",
        "전 심각도의 공개 스윕과 벤더 피드는 모두 주워지고 있다. 좁힌 목록은 &quot;무엇이 악용되고 있는지&quot;에 대답하지 않습니다."
      ],
      "metric": "CNA 9.9 에 대한 답변"
    },
    "wide": {
      "kicker": "POSTSCRIPT · THE WIDE SWEEP",
      "title": "CVE 목록이 지정하지 않는 4 건.",
      "lede": "이번에는 뉴스와 X도 찍었습니다. 거기에서 먼저 발견되어 일차 소스로 뒤를 잡은 4 건. 숫자는 벤더가 공표한 채로 있습니다.",
      "points": [
        "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: 악용중인 0 -day,<b>9.9</b>. 로그인된 경우 superuser. 온프레는 5.2.3.18 __/ 6.1.3.10 __/ 6.4.2.12",
        "Linux KSMBD: <code>ZDI-CAN-33774</code> 는 인증이 필요 9.0 . CVE도 mainline 수정도 아직 없다",
        "캡콤 CAPCOM ID <b>11,774,247</b> 건. 이름 .com 데스크탑 클라우드 최대 <b>26,739</b> 받침대 중지",
        "뉴스 보도가 출발점이었지만, 증거는 공급업체 페이지에서 나왔습니다. Arista는 10 / 24 로부터 최초 알림을 직접 받았습니다. 저는 실제 오용 사례, 인증 조건 및 수정된 버전을 재검토했습니다."
      ],
      "metric": "CVE 목록이 명명하지 않는 사안"
    },
    "php-next": {
      "kicker": "POSTSCRIPT · PHP, TWO DAYS LATER",
      "title": "긴급 수정은 나오지 않습니다.",
      "lede": "PHP가 10 - 23 에 발표한 CVE-2026-115560 는 다른 RCE 경로입니다. 영향판이나 스코어도 수정판도 나타내지 않고, 다음의 정기 릴리스로 완전한 권고를 내고 있다고 합니다.",
      "points": [
        "조건은 4 모두. 설정에서 <code>php_binary</code> / <code>php_serialize</code>, 실행 중 <code>ini_set</code> 에서 <code>php</code> 에,<code>session_start()</code> 이전 및 업로드 progress 사용",
        "실행 중에 handler 를 바꾸지 않는 앱은 기능을 유효하게 유지해도 상관없다 — PHP 자신이 그렇게 써 있습니다",
        "대책은 1 행: <b><code>session.upload_progress.enabled=0</code></b>. 10 - 21 의 109619 완화와 동일하며, 적용된 경우 추가 작업이 없습니다.",
        "지난번 10 / 23 취득에서는 NVD 레코드 없음. 이번 PHP 고지는 변하지 않고, KEV 추가 17 건에도 115560 는 없음. 게시되지 않은 것은 안전 증명이 아닙니다."
      ],
      "metric": "다음 정기 릴리스까지 완화"
    },
    "update-scope": {
      "kicker": "10-24 UPDATE · UPDATE-SCOPE",
      "title": "CVE 밖까지 다시.",
      "lede": "10 - 24 의 광역 조사. 신착과 갱신, 공개 채널과 국내 제품까지 재검토해, 중점 24 사안군을 출전 첨부로 정리했습니다.",
      "points": [
        "최근 30 시간의 NVD는<b>신규 526 / 갱신 3 , 531</b>. 중복되므로 합산하지 않습니다.",
        "GitHub는 창내<b>82 권고</b>, 중 Critical 6 . CVE 미부여도 대상",
        "KEV는 10 / 10 이후 추가<b>17 건</b>. 연구자·공식 14 피드와 JVN도 취득",
        "24 은 제품·사안을 정리한 군의 수. 신규 침해 24 건이 아닙니다."
      ],
      "metric": "reviewed groups"
    },
    "update-exploited": {
      "kicker": "10-24 UPDATE · UPDATE-EXPLOITED",
      "title": "먼저 악용된 2 건.",
      "lede": "Arista VCO와 Nextcloud Built-in CODE가 10 - 23 에 KEV 추가. CISA는 둘 다 법의학 조사를 요구합니다.",
      "points": [
        "VCO는<b>낮은 권한의 유효 계정</b>하지만 승격. 온프레 5.2.3.18 __/ 6.1.3.10 __/ 6.4.2.12 이상으로",
        "Built-in CODE는<b>26.4.303 이상으로 업데이트 또는 삭제</b>. 앱 비활성화만으로는 막을 수 없습니다.",
        "CODE 정지중의 proxy.php가 조건. Standalone Collabora Online은 제외",
        "CISA 기한은<b>10/26</b>(미 연방용). 수정 전 증거 보전, 수정 후에도 침해 조사"
      ],
      "metric": "KEV additions · 10.23"
    },
    "update-packages": {
      "kicker": "10-24 UPDATE · UPDATE-PACKAGES",
      "title": "이미지, Wasm, 인증, 프록시.",
      "lede": "이름이 다른 4 경계를 별도의 조건으로 확인합니다. 아무도 점수만으로는 자신의 노출을 모릅니다.",
      "points": [
        "<b>Pillow 13.0.0</b>에. FPX는 olefile 도입시, 확장자에 관계없이 화상 처리에 도착한다. 공개 PoC는 고정 구성에서의 입증",
        "<b>Wasmtime -115889</b>: 36 계열은 36.0.19 , 37 ~ 42 는 43.0.0 이후. Cranelift에서 신뢰할 수없는 Wasm을 처리하는 경계",
        "<b>Laravel 12.68.0 / 13.29.0</b>에. TokenGuard + 특정 MySQL / MariaDB 구성으로 인증 회피",
        "<b>Echo 4.16.1 / 5.4.1</b>에. WebSocket 거부 후 연결이 route 권한을 우회. upstream측의 독립인가는 별도"
      ],
      "metric": "package boundaries"
    },
    "update-runtime": {
      "kicker": "10-24 UPDATE · UPDATE-RUNTIME",
      "title": "앱아래도, 동고물도.",
      "lede": "GitLab 명의의 CVE에서도 Ruby 이용자에 관계해, OS의 Brotli를 갱신해도 Perl의 동봉 카피는 남습니다.",
      "points": [
        "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>에. 공격자의 정규식을 컴파일하는 앱 대상",
        "<code>Regexp.timeout</code>이나 길이 제한으로는 불충분. 4.0.8 은 전체 수정이 아닙니다.",
        "<b>IO::Compress::Brotli 0.023</b>에. 대상은 0.004001 이상 0.023 미만. OS 라이브러리 업데이트만으로는 고치지 않습니다.",
        "<b>NGINX 1.30.6 / 1.31.7</b>에. 5 건은 구성 의존적이며 일부 RCE에는 ASLR 회피 등도 필요"
      ],
      "metric": "runtime checks"
    },
    "update-agents": {
      "kicker": "10-24 UPDATE · UPDATE-AGENTS",
      "title": "에이전트의 권한을 누가 사용할 수 있습니까?",
      "lede": "인증, TLS, 노트 분리, 모델 읽기. AI의 이름이 붙기 전부터 있는 경계가, 비밀과 툴을 지키고 있습니다.",
      "points": [
        "<b>PraisonAI 4.6.59</b>에. AgentOS는 이전 수정판 4.5.128 에서도 무인증 chat가 남았다",
        "<b>req_llm 1.29.0</b>에. 1.9.0 이후의 WebSocket 경로에서 TLS 검증 부족. HTTP 경로는 별도",
        "<b>obsidian-tc 1.3.1</b>에. loopback에서도 Origin/DNS rebinding 및 vault 분리 확인",
        "<b>AWS Multi Model Server는 EOL</b>. 수정판 없음, 마이그레이션이 필요. 402 은 지출 상한과 서명 origin을 별도 확인"
      ],
      "metric": "agent boundaries"
    },
    "update-japan": {
      "kicker": "10-24 UPDATE · UPDATE-JAPAN",
      "title": "국내 업무 시스템도.",
      "lede": "외부 공개하는 개발 기반만이 아닙니다. 비즈니스 앱, LINE 연계, 관리 API의 경계를 확인합니다.",
      "points": [
        "<b>프리잔터 1.5.9.1</b>에. Linux/Docker등 + LDAP의 특정 구성으로, 유효 ID만의 로그인이 가능",
        "<b>LIFF SDK 2.31.1</b>에. 2.20.0 ~ 2.31.0 에 DOM XSS",
        "<b>JPCERT 10 / 23 업데이트</b>: AI 침투 기반의 악용 시도를 case E로 추가",
        "API 단위 권한 부여, token 최소 권한/기한, rate limit, 불필요한 관리 공개 중지. IP나 JA 4 만으로 침해를 단정하지 않음"
      ],
      "metric": "domestic checks"
    },
    "update-devices": {
      "kicker": "10-24 UPDATE · UPDATE-DEVICES",
      "title": "기기는 제품 계열까지.",
      "lede": "HPE의 공식 CSAF는 72 건, 그 중 8 건이 CVSS 10.0 . 산업 제품이나 단말에서는, 수정판이 나오지 않는 기종도 있습니다.",
      "points": [
        "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24 . CVE와 제품 시리즈를 비교",
        "<b>미쓰비시 전기 GENESIS / ICONICS 등</b>: 고정 challenge response, DCOM, libwebp 등. 제품별 수정/회피책으로",
        "<b>Lenovo AVB</b>: 공개 테스트 키를 사용한 다중 단말기. 물리적 액세스가 조건. EOL은 수정 없음",
        "만점이나 기종수를 실악용 확인과 혼동하지 않는다. 대응할 수 없는 제품은 마이그레이션도 판단"
      ],
      "metric": "HPE AOS CVEs"
    },
    "update-trust": {
      "kicker": "10-24 UPDATE · UPDATE-TRUST",
      "title": "갱신한, 그 앞의 확인.",
      "lede": "차단 목록, 시작 신뢰, 유출된 자격 증명. 패치의 적용만으로는 끝나지 않는 부분도 기록했습니다.",
      "points": [
        "<b>Firefox 158.0.1 / Android 158.0.2</b>등은 eMudhra 중간 CA 차단을 통합. Thunderbird 153.5.1 은 메일 인증 관련도 수정",
        "<b>BlackX</b>관리자 권한 취득 후 bootkit. OS 패치와 Secure Boot의 DBX 해지 반영은 별도",
        "<b>k 0 t 조사 70 , 000 초과</b>자격 정보 등. 피해 기업수가 아니다. 갱신과 병행하여 열쇠·잔존 액세스를 조사",
        "JPEG XR<b>jxrlib</b>심지어 연구보고 있습니다. CVE 미확인, 코드 실행 증거 없음. 배포 소스의 수정 상태 확인"
      ],
      "metric": "trust checks"
    },
    "oct25-priorities": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "갱신을, 닿는 곳까지.",
      "lede": "10 월 25 일 16:34 JST를 기준으로 전날 조사를 보완. 취득은 기준 시각 이후이며, 모두가 오늘의 신규 발생이 아닙니다.",
      "points": [
        "<b>Patch the Planet</b> 추천. 오픈 소스의 취약성 수정을 지원하는 노력입니다.",
        "실악용이 끝난 공개 자산 → 긴급 갱신 → 키와 권한 조사 → 동봉 복사까지 검증",
        "NVD 고정창은 신규<b>99</b>건 · 갱신<b>5,432</b>건. 겹치기 때문에 부족하다.",
        "KEV는 10 / 23 버전으로 남아 있습니다. 신규 게재 없음을 안전 선언으로 하지 않는다"
      ]
    },
    "oct25-fortinet": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "CVE의 공개를 기다리지 않는다.",
      "lede": "Fortinet은 5 제품의 긴급 hardening 업데이트를 안내. 추가 정보 PSIRT는 11 월 10 일 예정입니다.",
      "points": [
        "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
        "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
        "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9。<b>Authenticator</b>: 8.0.4 / 6.6.11",
        "기종·계열·갱신 경로를 대조. 관리 공개 제한은 잠정책. 고지로부터 실악용을 추정하지 않는다"
      ]
    },
    "oct25-runtime-trust": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "브라우저 밖에 남아, 신뢰.",
      "lede": "Java에는 10 / 24 의 긴급 업데이트, Python ssl에는 침해 된 키 denylist. 정례 갱신만으로 완료라고는 할 수 없습니다.",
      "points": [
        "<b>Java CVE-2026-114820</b>: 긴급 업데이트 또는 공식 keystore/해지 확인 절차. 각 JRE를 재부팅",
        "Oracle 테이블의 8 u 511 -b 32 등은<b>영향 버전</b>. 수정판으로 전기하지 않음",
        "<b>Python CVE-2026-115557</b>: main 병합과 배포판에 반영은 별도. 배포 소스에서 확인",
        "OS, certifi, 동봉 JRE, 컨테이너, 자체 스토어 재고"
      ]
    },
    "oct25-dns": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "DNS는 제품을 분리.",
      "lede": "BIND뿐만 아니라 resolver와 권한 DNS에도 업데이트. 비슷한 이름의 제품도 업데이트 대상이 다릅니다.",
      "points": [
        "<b>BIND</b>: 9.20.30 / 9.21.27 . GSS-TSIG 재전송과 구성 의존 조건을 비교",
        "<b>Unbound</b>: 1.26.2 . DoQ · 검증 · 부하의 5 건",
        "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8。<b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
        "<b>Knot DNS</b>: 3.6.2 . Knot Resolver와는 별도. CVE 수와 실제 악용 수를 혼동하지 마십시오."
      ]
    },
    "oct25-cloud-access": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "고치면 권한이 남는다.",
      "lede": "이번 업데이트는 ConnectWise의 초기 검증 결과와 LiteLLM에서 확인한 원인을 반영합니다. 공급업체 복구만으로는 고객의 잔여 액세스 권한이 완전히 삭제되지 않습니다.",
      "points": [
        "<b>ConnectWise</b>: 정식 복구 지시까지 무효 유지. 10 __/ 26 은 단계 재개 목표",
        "삭제를 서두르지 않고 증거를 저장. service principal 인증, Graph 조작, 추가 키·소유자·권한을 조사",
        "<b>LiteLLM</b>: 미실효 master key → GitHub OAuth token → CI 비밀. 초기 추측 업데이트",
        "영향 환경에서 먼저 pip를 시작하지 마십시오. 격리 및 재구성 및 도달 가능한 키 해지"
      ]
    },
    "oct25-bundles": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "동고처와 예외를 확인.",
      "lede": "압축 처리, 프록시, SNS 협력, 산업 클라이언트. 같은 갱신 작업에서도 완료 조건이 다릅니다.",
      "points": [
        "<b>Brotli</b>: Bun 1.4.4 , brotli 1.2.1 / brotlicffi 1.2.1.0 . 컴파일된 Bun 실행물도 재빌드",
        "<b>Postiz</b>: 2.25.3 . 등록 사용자와 연계 기능의 조건을 확인",
        "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1 . 그러나 CVE-2026-111817 은<b>9.2.16 에서 수정되지 않음</b>",
        "<b>open62541</b>: 1.5.7 . 악성 OPC UA 서버로부터 형식 정의를 받는 클라이언트도 대상"
      ]
    },
    "http2shell": {
      "kicker": "POST FOLLOW-UP · CVE-2026-111497",
      "title": "HTTP 2 Shell. 같은 결함, 동봉 끝까지.",
      "lede": "지정된 게시물은 기본 소스와 비교됩니다. Brotli의 배포 경로는 Node.js 외에도 검사됩니다. 이는 HTTP/ 2 에 국한된 새로운 취약점이 아닙니다.",
      "points": [
        "Google CNA는<b>CVSS v4.0 9.2</b>. Node 2 Shell과 동일한 CVE. 실제 악용 확인과는 별도",
        "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8 . Brotli 배포 설정 조건",
        "<b>Istio</b>: 1.31.2 / 1.30.6 / 1.29.9 . 1.29 은 EOL. gateway와 sidecar도 확인",
        "<b>curl · requests · httpx</b>: 실제 종속 디코더와 자동 배포를 확인합니다. Accept-Encoding의 변경만으로는 부족"
      ],
      "metric": "Google CNA · CVSS v4.0"
    },
    "tailworm-overview": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Tailworm. 내부 경계를 검토합니다.",
      "lede": "Tailscale/headscale의 연구 보고서. 허가된 단말기에서 앞으로 진행하는 범위와 연결 후 권한이 초점입니다.",
      "points": [
        "연구대상은<b>Tailscale 1.104.2 / headscale 0.29.5</b>. 이 버전을 수정 버전이라고 부르지 않음",
        "연구자의<b>11 항목</b>에는 설정상의 주의도 포함한다. 11 개의 CVE, 실제 피해가 아님",
        "벤더는 조사·수정중.<b>모든 사용자에게 SSH 정지를 권장하지 않음</b>",
        "먼저 확인:<b>Tailscale SSH 활성화 터미널 및 연결 허용</b>. 일반 OpenSSH와 분리"
      ]
    },
    "tailworm-ssh": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "연결할 수 있다. 그 앞에서 루트가 된다.",
      "lede": "연구원은 SSH 전송 유닉스 소켓 작업이 루트에서 발생하는 문제와 경로 검사 충돌을보고. 공급업체도 연결 후 권한을 조사 중입니다.",
      "points": [
        "전제는<b>SSH 연결 권한 및 해당 전송 권한</b>. 모든 단말기로의 무인증 침입이 아님",
        "socket 접속·치환의 앞에 Docker나 관리 API. 연구원은 실험실에서 권한 승격을 보고",
        "<b>필요한 소스 → 필요한 목적지로 제한</b>불필요한 전송 감소",
        "<b>체크 모드는 입구 추가 인증</b>. 연결 후 권한 승격을 수정하지 않습니다."
      ]
    },
    "tailworm-headscale": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "headscale은 다른 조치가 필요합니다.",
      "lede": "자체 호스트 제어면과 Tailscale SaaS를 구분합니다. 연구자들은 공개 등록 경로의 메모리 고갈과 캐시 배출을 보고하고 있다.",
      "points": [
        "<b>headscale 0.29.5</b>검증. 등록 경로의 일부 DoS는 계정이 필요 없음",
        "연구자는<b>SSH 전송을 억제할 수 없음</b>그리고 지적. SaaS의 설정을 유용하지 않고 허가 삭감 · 정지를 검토",
        "공개 범위 · rate limit · 메모리 상한 · 재기동 감시를 확인.<b>완화는 수정이 아니다.</b>",
        "악성 DERP 응답의 client DoS는<b>악성 relay에 연결하는</b>또 다른 전제"
      ]
    },
    "tailworm-connector": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "앱 권한이 다른 대상으로.",
      "lede": "대상은 실험 conn 25 . 연구자는 이용 권한을 가진 단말이 커넥터에 임의의 실제 목적지를 선택할 수 있다고 보고하고 있습니다.",
      "points": [
        "<b>conn 25 및 사용 capability</b>가 전제. 모든 커넥터 구성으로 일반화하지 않음",
        "커넥터 대상 LAN, 클라우드 metadata, cluster 서비스를 실제 대상에서 확인",
        "불필요한 사용 권한을 제거하고,<b>출구측에서 목적지 제한</b>. IPv 4 /IPv 6 도 확인",
        "Kubernetes의 egress 한계는<b>CNI · hostNetwork · 전송 경로</b>실측. 설정 투입만으로 완료하지 않는다"
      ]
    },
    "tailworm-serve": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Serve의 설정으로부터, 관리구를 확인.",
      "lede": "유닉스 소켓에 대한 TCP 전송, 모든 인터페이스에 bind, HTTP/ 2 의 mount간 승인. 설정과 경로를 나누어 재고.",
      "points": [
        "<b>Serve 특권 소켓으로 TCP 전송</b>찾습니다. 운영자의 해당 설정이 필요한 문제",
        "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b>설정상의주의. 모든 서버의 기본 동작이 아닙니다.",
        "header 의존의 backend 인가·복수 mount를 확인. Funnel의 지적도 위협 모델을 구별",
        "IP 방화벽은<b>로컬 Unix socket 작업을 검사하지 않음</b>. 불필요한 설정 제거"
      ]
    },
    "tailworm-response": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "확인하고 좁히고 수정을 쫓는다.",
      "lede": "이는 연구실에서의 자동화된 증식과 실제 환경에서의 기생충 발생을 구분하는 기준입니다. 여기에 제시된 주요 자료에 따르면, 실제 환경에서의 꼬리기생충 감염은 아직 확인되지 않았습니다.",
      "points": [
        "SSH·headscale·conn 25 ·Serve를 재고.<b>기능별 성립 조건</b>따라 허가 축소",
        "<b>수정판·전용 CVE/CVSS는 미확정</b>. 1.104.2 의 인증서 수정과 섞이지 않음",
        "침해를 의심하면 흔적 보전 · 격리 후,<b>제어면에서 단말기를 해지</b>도달 가능한 키 업데이트",
        "재설치만으로는 복사된 identity는 해지되지 않는다. 공식 권고와 갱신을 계속 확인"
      ]
    },
    "night-delta": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "광역 조사. 건수보다 성립 조건.",
      "lede": "16:34 → 23:18 JST의 고정 창을 추가 취득. 이전 회분에 중복되는 갱신을, 피해 건수로서 합산하지 않습니다.",
      "points": [
        "<b>NVD 신규 87 / 갱신 87</b>. 이번 두 집합은 같은 87 건. 전체 심각도로 수집",
        "<b>GitHub 권고 16 건</b>는 unreviewed. package 란이 비어도 무영향으로는 하지 않는다",
        "<b>KEV는 10 / 23 판 · 1 , 756 건</b>. 새로운 추가 없음은 공격 없음 증명이 아닙니다.",
        "Firecrawl·Dokploy·rotki 등을 일차 자료로 대조.<b>미확정 수정판을 보완하지 않음</b>"
      ]
    },
    "night-restoration": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "복구의 목표는 재접속의 허가가 아니다.",
      "lede": "ConnectWise는 오늘 23:00 JST로 갱신. Cloud Backup은 10 / 26 의 단계적 onboarding을 목표로 합니다.",
      "points": [
        "<b>먼저 기존 백업 복원 액세스</b>, 이후 재등록을 안내할 계획",
        "<b>개별 공식 절차까지 연결을 비활성화 유지</b>. 기반 복구는 전체 기능 복구를 의미하지 않습니다.",
        "백업의 보전과 고객 M 365 측의 인증, 권한, 메일 조작의 조사는 별도",
        "PHP·GitLab·Brotli, 실악용 끝난 KEV, Fortinet hardening도 계속.<b>상세 보고서에서 역할별 확인</b>"
      ]
    },
    "morning-cutoff": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "10:27 . 무엇이 변화했는가?",
      "lede": "PHP 이후를 날짜별로 되돌아보고 오늘 아침까지 업데이트를 쫓는다. 데이터베이스에 수록과 사건의 발생은 별도입니다.",
      "points": [
        "NVD는 신규<b>28 건</b>, 업데이트<b>4 , 276</b>. 모든 새는 업데이트 세트에 포함됩니다.",
        "GHSA <b>93 건</b>모든 건 unreviewed. 지난번 NVD의 후추 등록을 다수 포함",
        "<b>정부 기관에 대한 초기 침입 = PHP 2 Shell</b>라는 Unit 42 의 설명은 철회. AWS 시험 관측과는 별도"
      ]
    },
    "morning-dotnet": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "업데이트했다. 그래도 수정이 없었다.",
      "lede": "Windows .NET CVE-2026-70197 . Microsoft는 10 / 13 업데이트에 수정 사항이 포함되지 않았다고 설명하고 임시 업데이트를 게시했습니다.",
      "points": [
        "공표 <b>10/26 03:50 JST</b>. IPv 4 /IPv 6 datagram 사이의 SocketAsyncEventArgs 재사용 조건",
        "대상 계열은 <b>8.0.33 / 9.0.22 / 10.0.14</b>등의 수정판을 대조",
        "self-contained 앱은<b>재빌드 및 재배포</b>그리고 가동하는 runtime도 확인"
      ]
    },
    "morning-ot": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "PHP는 기기 안에도 있다.",
      "lede": "오늘 아침 JVN 업데이트에는 Ruggedcom의 PAN-OS에 대한 PHP 2 Shell 파급이 포함됩니다. Siemens 모든 제품에 동일한 결함이 있다는 이야기는 아닙니다.",
      "points": [
        "<b>09:00 JST</b>의 피드 업데이트. SSA-__ 566512 자체의 공표일과는 별도",
        "PAN-OS는<b>일부 계열에서 수정판 제공됨</b>. 다른 계열의 ETA로 나누기",
        "Starman / Plack도 추보. PHP뿐만 아니라<b>HTTP 처리 경계</b>확인"
      ]
    },
    "morning-dates": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "날짜부터 읽기. 지금의 대응으로 돌아온다.",
      "lede": "10 월 17 일부터 26 일까지 10 일분의 독립 페이지. 관측일, 공표일, 수정일과 후일 알게 된 것을 나누었습니다.",
      "points": [
        "<a href=\"./timeline.html\">날짜별 기록 →</a> / <a href=\"./update-20261026.html\">10 / 26 10:27 전체 요약 →</a>",
        "공개 서비스 갱신 및 침해 조사, 자격 증명 해지 계속",
        "Tailworm의 최소 수정 버전과 ConnectWise의 재개 완료<b>이번 미확정</b>. 일정을 실적으로 바꾸지 않음"
      ]
    },
    "afternoon-deployment": {
      "kicker": "14:56 UPDATE · 배포 방법 확인",
      "title": "업데이트했다. 그 바이너리는 대체되었습니까?",
      "lede": ".NET Brotli 권고를 보완. 공유 runtime, self-contained, NativeAOT에서는 수정을 실행 중인 앱에 전달하는 절차가 다릅니다. 그림은 배치 경로의 개략도입니다.",
      "points": [
        "ASP.NET Core / HttpClient의 Brotli 압축 해제는<b>기본적으로 비활성화</b>. 명시적 활성화 및 직접 API 입력 확인",
        "8.0.33 / 9.0.22 / 10.0.14 등을 대조. self-contained는 재배치,<b>NativeAOT는 SDK 등을 갱신하여 재 publish · 재배치</b>",
        "이것은 04:06 JST의 기공표 권고의 보완. 오후에 발생한 새로운 침해가 아닙니다."
      ],
      "metric": "deployment paths · 개략도"
    },
    "afternoon-release": {
      "kicker": "14:56 UPDATE · 제공, 배포, 복구를 분리",
      "title": "공개됨. 배달 중. 재개 목표.",
      "lede": "같은 「갱신」에서도 상태는 다릅니다. 제공된 수정, 기기별 단계 전달, 복구 목표를 나누어 실제로 사용하는 버전과 개별 안내를 확인합니다. 그림은 상태의 개략도입니다.",
      "points": [
        "PAN-OS : 11.1 계열 4 hotfix의 제공 상태를 갱신. CNA JSON은<b>14:45 JST</b>, CSAF 이력과의 시간차도 기록",
        "Neat OS 26.5.4 은<b>단계 전달</b>. 26 일이 된 것만으로 모든 기기가 수정되었습니다.",
        "ConnectWise의 다음 안내 예정은<b>23:00 JST</b>. 재개 목표를 재연결 권한으로 대체하지 않음",
        "<a href=\"./update-20261026-1456.html\">14:56 에 대한 광역 보고서, 대응책 및 주요 자료 →</a>"
      ]
    },
    "night-account-controls": {
      "kicker": "21:35 UPDATE · 계정 확인",
      "title": "암호 변경 및 남은 연결 확인.",
      "lede": "GMO의 21 시속보는 FX 계좌 외에 증권, 메일, Google 계정 등의 보호를 안내하고 있습니다. 그림은 확인할 범위의 모식도입니다.",
      "points": [
        "다른 신뢰할 수있는 단말기에서 비밀번호 변경 ·<b>모든 기기 로그아웃</b>· 다 요소 인증 확인",
        "눈에 띄지 않는 연계 앱, 메일 전송, 확장 기능, 접속 단말을 점검. 브라우저 동기화는 확인이 끝날 때까지 중지",
        "예방적인 점검의 안내이며, 이용자 전원의 단말이 감염되었다고 확정한 것은 아닙니다",
        "<a href=\"./update-20261026-2135.html#gmo-sixth\">공식 안내 및 대응 범위 읽기 →</a>"
      ]
    },
    "night-package-response": {
      "kicker": "21:35 UPDATE · 배포 및 실행 환경",
      "title": "악의 있는 버전을 끼워넣을 때, 어디까지 확인하는가?",
      "lede": "npm · PyPI의 malware 권고를 추가 수집했습니다. 기존 취약점과 구분하여 설치 또는 가져오기 시점에서 수행된 작업을 확인합니다. 그림은 대응 경로의 모식도입니다.",
      "points": [
        "@worca/app의 대상 RC판, npm의 채굴·지속화 처리, PyPI netweavex의 외부 코드 취득 등,<b>이름과 대상 버전 비교</b>",
        "해당판이 실행되었을 경우는 환경을 격리해, 도달할 수 있던 자격증명을 안전한 단말로부터 실효. 권고에 따라 재구성 고려",
        "분석상의 PROBABLY_PENTEST 분류를 포함하는 다른 2 건을 동일한 피해가 확인된 것으로 취급하지 않음",
        "<a href=\"./update-20261026-2135.html#npm-worca\">패키지별 조건 및 대책 →</a>"
      ]
    },
    "night-restore-status": {
      "kicker": "00:18 UPDATE · 복구 및 예고",
      "title": "준비 계속, 예고, 전달 재개는 다른 상태.",
      "lede": "ConnectWise의 23:00 업데이트는 온보딩 준비를 계속합니다. GMO 제 7 보의 12:00 는 공격자 예고. Softbank는 재해 및 대피 정보를 23:17 로 재개했습니다. 그림은 상태의 개략도입니다.",
      "points": [
        "ConnectWise: 기존 백업에서 복원 시작 보고서가 아닙니다.<b>개별 절차까지 연결은 비활성화</b>",
        "GMO: 요구에 응하지 않는다. 제 6 보의 계정 체크는 계속된다. 00:20 수정은 기준 후",
        "Softbank 재개는 해당 메일 경로. PHP 전체 수정 완료가 아님",
        "<a href=\"./update-20261027-0018.html#connectwise-1400\">00:18 읽기 보고서로 →</a>"
      ]
    },
    "brotli-reach": {
      "kicker": "00:18 UPDATE · BROTLI REACH",
      "title": "HTTP/ 2 라는 이름에서도 결함은 decoder.",
      "lede": "HTTP 2 Shell/Node 2 Shell/Brotli 2 Shell은 동일한 CVE-2026-111497 입니다. 도달 경로는 HTTP 응답, .NET API, JPEG XL, ClickHouse, Parket에 따라 다릅니다. 그림은 도달의 개략도입니다.",
      "points": [
        ".NET은 수정 런타임에.<b>NativeAOT는 재발행</b>. ASP.NET/HttpClient br 배포는 기본적으로 해제",
        "FFmpeg/libjxl·ClickHouse·Arrow는 RCE 실증 없음. 수정 릴리스 미확인 물건을 수정되지 않은 것으로 취급",
        "Cloudflare 비상 WAF는 기본 Log. Bandit HTTP/ 2 일련은 별도의 클러스터",
        "<a href=\"./update-20261027-0018.html#brotli-jfrog-reach\">하류의 도달과 대책 →</a>"
      ]
    },
    "morning-consul-identity": {
      "kicker": "07:47 UPDATE · SERVICE IDENTITY",
      "title": "API의 인가 누설은, 증명서와 비밀열쇠에 도착한다.",
      "lede": "CVE-2026-105765 은 Consul agent HTTP API에 있는 cached leaf 인증서 응답의 권한 회피입니다. 그림은 성립 조건과 대응의 모식도로 실제 피해의 관측도가 아닙니다.",
      "points": [
        "대상은<b>1.17.0〜2.0.4</b>ACL 유효 구성. HTTP API는 기본 loopback입니다. API에의 도달과, 대상의 증명서·비밀키의 cache가 성립 조건",
        "Community <b>2.1.0</b>、Enterprise <b>2.1.0 / 1.21.19</b>의 계열별 안내를 대조",
        "API 게시를 제한합니다. 갱신과 노출 얻은 service identity의 조사는 별도로 실시",
        "<a href=\"./update-20261027-0747.html#consul-leaf\">조건과 출처 읽기 →</a>"
      ]
    },
    "morning-sandbox-auth": {
      "kicker": "07:47 UPDATE · SANDBOX AUTH",
      "title": "sandbox에서도 공개 API에는 인증이 필요하다.",
      "lede": "OpenHands SDK의 CVE-2026-112346 은 1.52.0 미만. launcher가 0.0.0.0 로 bind하고 session_api_keys가 비어있을 때 공개 포트에서 인증되지 않은 명령을 실행할 수있는 조건입니다.",
      "points": [
        "루트 실행은<b>sandbox 내</b>. mount 된 workspace 나 건네받은 secret에도 영향을 줄 수 있다",
        "<b>1.52.0</b>이후 수정사항을 비교하여 공개 포트와 인증 설정을 점검",
        "외부에 도달 가능했던 환경은 로그 확인과 secret의 해지·재발행을 별도로 실시한다",
        "<a href=\"./update-20261027-0747.html#openhands-sdk\">조건과 출처 읽기 →</a>"
      ]
    },
    "evening-disclosure": {
      "kicker": "18:47 UPDATE · EVIDENCE STATES",
      "title": "공개 확인과 내용 확인은 별도.",
      "lede": "GMO는 12:30 에 회사·고객의 정보라고 칭하는 것의 공개를 확인. 내용은 검증중, 13:55 시점의 랜섬웨어 공격은 미확인입니다. 그림은 확인 상태의 모식도입니다.",
      "points": [
        "해석 완료 단말로부터 멀웨어 미확인이라는 설명을,<b>모든 단말기의 안전 확인</b>펼치지 않음",
        "공식 기기 격리 및 다른 신뢰할 수 있는 기기로부터의 계정 보호 확인",
        "공개 정보에의 액세스·전재·유도 링크 확산을 앞두고, 편승 피싱에 주의",
        "<a href=\"./update-20261027-1847.html#gmo-publication\">제 8 ~ 11 보와 대응 읽기 →</a>"
      ]
    },
    "evening-release": {
      "kicker": "18:47 UPDATE · RELEASE GATES",
      "title": "예정 그대로의 판과, 선적이 끝난 판.",
      "lede": "PAN-OS의 PHP 대책은 계열별로 진행. CVE-2026-109618 / CVE-2026-109619 의 KEV 원본 차이도 확인했습니다. 그림은 출하와 적용·조사를 나누는 모식도입니다.",
      "points": [
        "<b>10.2.13-h27 / 10.2.16-h12</b>09:10 JST에 배송됨 확인",
        "<b>12.1.7-h11 / 12.2.4-h1</b>13:03 JST에 배송됨 확인. 다른 계열의 ETA는 별도로 일치",
        "수정 제공, 수중 기기에의 적용, 침입 흔적의 조사는 다른 작업",
        "<a href=\"./update-20261027-1847.html#pan-hotfix\">계열별 출하 상태와 KEV 유보 →</a>"
      ]
    },
    "evening-threshold": {
      "kicker": "18:47 UPDATE · MPC BOUNDARY",
      "title": "1 party의 share는 완전한 개인 키가 아닙니다.",
      "lede": "Fireblocks mpc-lib CVE-2026-90975 . descendant share와 chain code에서, 그 party의 ancestor share에 도착할 가능성. threshold 계층은 남아 있습니다. 그림은 조건의 개략도입니다.",
      "points": [
        "BIP 32 hardened derivation,<b>share 계층 구조의 완전한 격리</b>신용하지 마라.",
        "chain code를 비밀로 보호하고 watch-only 정보에서 배포하지 않음",
        "CERT 본문에서는 수정 미제공. leaf share 침해시 같은 party의 계층을 조사",
        "<a href=\"./update-20261027-1847.html#fireblocks-share-boundary\">성립 조건과 잠정 완화 읽기 →</a>"
      ]
    },
    "evening-package": {
      "kicker": "18:47 UPDATE · PACKAGE RESPONSE",
      "title": "삭제하기 전에 실행한 환경을 확인.",
      "lede": "npm과 PyPI에 특정 버전의 악성 패키지 보고서. 그림은 도입 이력·격리·secret 실효의 대응 경로로, 실제 피해의 관측도가 아닙니다.",
      "points": [
        "npm <b>@camera.ui/camera-ui-nvr-windows-amd64 1.6.1</b>：GHSA-2w7v-jwxh-w7wc",
        "PyPI <b>h13t0ry-hello-demo 0.1.0</b>: GHSA-5crq-52j9-fc74 . import시 reverse shell보고",
        "lockfile·CI·실행 이력을 대조. 해당 환경을 격리하고 다른 안전한 단말기에서 보안을 해지 · 재발행",
        "<a href=\"./update-20261027-1847.html#malware-camera-ui\">대상 package와 대응 읽기 →</a>"
      ]
    }
  }
});
