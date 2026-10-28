/* First-party preference consent. No network requests, cookies or analytics. */
(function () {
  'use strict';
  const KEY = 'briefing-consent', LANGUAGE = 'briefing-lang';
  const VERSION = 1, LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const copies = {"ja":{"title":"Cookieの利用について","body":"このサイトが独自に置く任意Cookieはありません。任意の保存は表示言語の記憶だけです。同意するまで保存せず、拒否してもすべての内容を閲覧できます。解析・広告用Cookieは導入していません。","required":"配信・防御に必要なCloudflareのCookieや通信情報は、この任意設定の対象外です。選択自体は180日間、このブラウザーに保存します。","reject":"拒否","accept":"同意","policy":"プライバシーポリシー","settings":"Cookie設定","unknown":"任意の保存：未選択（無効）","yes":"言語の保存：同意済み","no":"任意の保存：拒否済み","saved":"選択を保存しました。Cookie設定からいつでも変更できます。","temporary":"このブラウザーでは保存できません。選択はこのページを開いている間だけ適用されます。"},"en":{"title":"About the use of cookies","body":"This site does not use any optional cookies. The only optional saving is the display language setting. Nothing is saved until you consent, and you can still view all content even if you refuse. We do not use any analytics or advertising cookies.","required":"Cloudflare cookies and communication information necessary for delivery and protection are not subject to this optional setting. The selection itself will be saved in this browser for 180 days.","reject":"rejection","accept":"consent","policy":"Privacy policy","settings":"Cookie Settings","unknown":"Optional storage: no choice made (disabled)","yes":"Language preservation: Agreed","no":"Optional save: Rejected","saved":"Your selection has been saved. You can change it at any time in your cookie settings.","temporary":"This browser cannot save. Your selection will only be applied while this page is open."},"zh":{"title":"关于 Cookie 的使用","body":"本网站不使用任何可选的 Cookie。唯一可选的保存设置是显示语言设置。在您同意之前，我们不会保存任何内容，即使您拒绝，您仍然可以浏览所有内容。我们不使用任何分析或广告 Cookie。","required":"用于交付和安全保护的 Cloudflare Cookie 和通信信息不受此可选设置的影响。此选择将在此浏览器中保存180天。","reject":"拒绝","accept":"同意","policy":"隐私政策","settings":"Cookie 设置","unknown":"可选保存：未选中（已禁用）","yes":"语言保护：同意","no":"可选保存：已拒绝","saved":"您的选择已保存。您可以随时在 Cookie 设置中更改它。","temporary":"此浏览器无法保存。您的选择仅在当前页面打开时生效。"},"ko":{"title":"쿠키 사용에 관하여","body":"이 사이트는 선택적 쿠키를 사용하지 않습니다. 유일하게 선택적으로 저장되는 정보는 화면 표시 언어 설정뿐입니다. 사용자가 동의하기 전까지는 아무것도 저장되지 않으며, 동의하지 않더라도 모든 콘텐츠를 볼 수 있습니다. 분석 또는 광고 쿠키도 사용하지 않습니다.","required":"Cloudflare 쿠키 및 전송과 보호에 필요한 통신 정보는 이 선택적 설정의 적용을 받지 않습니다. 선택 사항은 180 일 동안 이 브라우저에 저장됩니다.","reject":"배제","accept":"동의","policy":"개인 정보 보호 정책","settings":"쿠키 설정","unknown":"선택 저장: 선택되지 않음(사용 안 함)","yes":"언어 보존: 동의함","no":"선택적 저장: 거부됨","saved":"선택하신 내용이 저장되었습니다. 쿠키 설정에서 언제든지 변경할 수 있습니다.","temporary":"이 브라우저는 저장 기능을 지원하지 않습니다. 선택하신 내용은 이 페이지가 열려 있는 동안에만 적용됩니다."},"es":{"title":"Acerca del uso de cookies","body":"Este sitio no utiliza cookies opcionales. La única configuración de idioma que se guarda es opcional. No se guarda nada hasta que usted dé su consentimiento, y podrá ver todo el contenido aunque lo rechace. No utilizamos cookies de análisis ni de publicidad.","required":"Las cookies de Cloudflare y la información de comunicación necesaria para la entrega y la protección no están sujetas a esta configuración opcional. La selección se guardará en este navegador durante 180 días.","reject":"rechazo","accept":"consentir","policy":"política de privacidad","settings":"Configuración de cookies","unknown":"Guardar opcionalmente: No seleccionado (deshabilitado)","yes":"Preservación del idioma: Acordado","no":"Guardado opcional: Rechazado","saved":"Tu selección se ha guardado. Puedes cambiarla en cualquier momento en la configuración de cookies.","temporary":"Este navegador no puede guardar la selección. Esta solo se aplicará mientras esta página esté abierta."},"fr":{"title":"À propos de l'utilisation des cookies","body":"Ce site n'utilise aucun cookie optionnel. Seul le choix de la langue d'affichage est enregistré. Aucune donnée n'est enregistrée sans votre consentement, et vous pouvez consulter l'intégralité du contenu même si vous refusez. Nous n'utilisons aucun cookie d'analyse ni de publicité.","required":"Les cookies et les informations de communication de Cloudflare nécessaires à la livraison et à la protection ne sont pas concernés par ce paramètre optionnel. Votre choix sera enregistré dans ce navigateur pendant 180 jours.","reject":"rejet","accept":"consentement","policy":"politique de confidentialité","settings":"Paramètres des cookies","unknown":"Sauvegarde facultative : non sélectionnée (désactivée)","yes":"Préservation des langues : Accord conclu","no":"Sauvegarde optionnelle : Rejetée","saved":"Votre sélection a été enregistrée. Vous pouvez la modifier à tout moment dans vos paramètres de cookies.","temporary":"Ce navigateur ne peut pas enregistrer votre sélection. Celle-ci ne sera prise en compte que pendant que cette page est ouverte."},"de":{"title":"Informationen zur Verwendung von Cookies","body":"Diese Website verwendet keine optionalen Cookies. Lediglich die Einstellung der Anzeigesprache kann optional gespeichert werden. Es werden keine Daten gespeichert, bis Sie Ihre Zustimmung erteilen, und Sie können alle Inhalte auch dann ansehen, wenn Sie diese ablehnen. Wir verwenden keine Analyse- oder Werbe-Cookies.","required":"Cloudflare-Cookies und Kommunikationsinformationen, die für die Bereitstellung und den Schutz erforderlich sind, unterliegen dieser optionalen Einstellung nicht. Die Auswahl selbst wird für 180 Tage in diesem Browser gespeichert.","reject":"Ablehnung","accept":"Zustimmung","policy":"Datenschutzrichtlinie","settings":"Cookie-Einstellungen","unknown":"Optionales Speichern: Nicht ausgewählt (deaktiviert)","yes":"Spracherhalt: Einverstanden.","no":"Optionale Speicherung: Abgelehnt","saved":"Ihre Auswahl wurde gespeichert. Sie können sie jederzeit in Ihren Cookie-Einstellungen ändern.","temporary":"Dieser Browser kann nicht speichern. Ihre Auswahl wird nur angewendet, solange diese Seite geöffnet ist."},"pt":{"title":"Sobre o uso de cookies","body":"Este site não utiliza cookies opcionais. A única configuração opcional de idioma de exibição é salva. Nada é salvo até que você dê seu consentimento, e você ainda poderá visualizar todo o conteúdo mesmo se recusar. Não utilizamos cookies de análise ou publicidade.","required":"Os cookies e as informações de comunicação do Cloudflare necessários para a entrega e proteção não estão sujeitos a esta configuração opcional. A seleção será salva neste navegador por 180 dias.","reject":"rejeição","accept":"consentimento","policy":"política de Privacidade","settings":"Configurações de cookies","unknown":"Armazenamento opcional: nenhuma escolha feita (desativado)","yes":"Preservação da língua: Concordamos","no":"Salvamento opcional: Rejeitado","saved":"Sua seleção foi salva. Você pode alterá-la a qualquer momento nas suas configurações de cookies.","temporary":"Este navegador não pode salvar. Sua seleção só será aplicada enquanto esta página estiver aberta."},"ru":{"title":"О применении файлов cookie","body":"Этот сайт не использует никаких дополнительных файлов cookie. Единственное, что можно сохранить по желанию, — это настройки языка отображения. Ничего не сохраняется, пока вы не дадите согласие, и вы сможете просматривать весь контент, даже если откажетесь. Мы не используем аналитические или рекламные файлы cookie.","required":"Файлы cookie Cloudflare и информация о коммуникациях, необходимая для доставки и защиты, не подлежат этой дополнительной настройке. Сам выбранный параметр будет сохранен в этом браузере на 180 дней.","reject":"отказ","accept":"согласие","policy":"политика конфиденциальности","settings":"Настройки файлов cookie","unknown":"Дополнительное хранилище: выбор не сделан (отключено)","yes":"Сохранение языка: Согласовано","no":"Сохранение по желанию: Отклонено","saved":"Ваш выбор сохранен. Вы можете изменить его в любое время в настройках файлов cookie.","temporary":"Этот браузер не может сохранить изменения. Ваш выбор будет применен только во время работы этой страницы."},"ar":{"title":"حول استخدام ملفات تعريف الارتباط","body":"لا يستخدم هذا الموقع أي ملفات تعريف ارتباط اختيارية. الإعداد الوحيد الاختياري هو لغة العرض. لا يتم حفظ أي بيانات إلا بعد موافقتك، ويمكنك الاطلاع على جميع المحتويات حتى في حال رفضك. لا نستخدم أي ملفات تعريف ارتباط للتحليلات أو الإعلانات.","required":"لا تخضع ملفات تعريف الارتباط الخاصة بـ Cloudflare ومعلومات الاتصال الضرورية للتسليم والحماية لهذا الإعداد الاختياري. سيتم حفظ الاختيار نفسه في هذا المتصفح لمدة 180 يومًا.","reject":"الرفض","accept":"موافقة","policy":"سياسة الخصوصية","settings":"إعدادات ملفات تعريف الارتباط","unknown":"التخزين الاختياري: لم يتم اختيار أي خيار (معطل)","yes":"الحفاظ على اللغة: موافق عليه","no":"حفظ اختياري: مرفوض","saved":"تم حفظ اختيارك. يمكنك تغييره في أي وقت من خلال إعدادات ملفات تعريف الارتباط.","temporary":"لا يمكن لهذا المتصفح حفظ التغييرات. سيتم تطبيق اختيارك فقط أثناء فتح هذه الصفحة."},"hi":{"title":"कुकीज़ के उपयोग के बारे में","body":"यह साइट किसी भी प्रकार की वैकल्पिक कुकीज़ का उपयोग नहीं करती है। केवल भाषा सेटिंग को ही वैकल्पिक रूप से सहेजा जा सकता है। आपकी सहमति के बिना कुछ भी सहेजा नहीं जाता है, और यदि आप मना भी करते हैं तो भी आप सभी सामग्री देख सकते हैं। हम किसी भी प्रकार की एनालिटिक्स या विज्ञापन कुकीज़ का उपयोग नहीं करते हैं।","required":"क्लाउडफ्लेयर कुकीज़ और डिलीवरी एवं सुरक्षा के लिए आवश्यक संचार जानकारी इस वैकल्पिक सेटिंग के अंतर्गत नहीं आती हैं। यह चयन इस ब्राउज़र में 180 दिनों के लिए सहेजा जाएगा।","reject":"अस्वीकार","accept":"सहमति","policy":"गोपनीयता नीति","settings":"कुकी सेटिंग्स","unknown":"वैकल्पिक संग्रहण: कोई विकल्प नहीं चुना गया (अक्षम)","yes":"भाषा संरक्षण: सहमत","no":"वैकल्पिक सेव: अस्वीकृत","saved":"आपका चयन सहेज लिया गया है। आप इसे अपनी कुकी सेटिंग में कभी भी बदल सकते हैं।","temporary":"यह ब्राउज़र सेव नहीं कर सकता। आपका चयन केवल इस पृष्ठ के खुले रहने तक ही लागू होगा।"},"id":{"title":"Tentang penggunaan cookie","body":"Situs ini tidak menggunakan cookie opsional apa pun. Satu-satunya penyimpanan opsional adalah pengaturan bahasa tampilan. Tidak ada yang disimpan sampai Anda memberikan persetujuan, dan Anda tetap dapat melihat semua konten meskipun Anda menolak. Kami tidak menggunakan cookie analitik atau iklan apa pun.","required":"Cookie Cloudflare dan informasi komunikasi yang diperlukan untuk pengiriman dan perlindungan tidak tunduk pada pengaturan opsional ini. Pilihan itu sendiri akan disimpan di browser ini selama 180 hari.","reject":"penolakan","accept":"izin","policy":"Kebijakan privasi","settings":"Pengaturan Cookie","unknown":"Penyimpanan opsional: tidak ada pilihan yang dibuat (dinonaktifkan)","yes":"Pelestarian bahasa: Disetujui","no":"Penyimpanan opsional: Ditolak","saved":"Pilihan Anda telah disimpan. Anda dapat mengubahnya kapan saja di pengaturan cookie Anda.","temporary":"Browser ini tidak dapat menyimpan. Pilihan Anda hanya akan diterapkan selama halaman ini terbuka."},"uk":{"title":"Про використання файлів cookie","body":"Цей сайт не використовує жодних додаткових файлів cookie. Єдиним додатковим збереженням є налаштування мови відображення. Ніщо не зберігається, доки ви не дасте свою згоду, і ви все одно можете переглядати весь контент, навіть якщо відмовитеся. Ми не використовуємо жодних аналітичних чи рекламних файлів cookie.","required":"Файли cookie Cloudflare та комунікаційна інформація, необхідні для доставки та захисту, не підпадають під дію цього додаткового налаштування. Сам вибір буде збережено в цьому браузері протягом 180 днів.","reject":"відмова","accept":"згода","policy":"Політика конфіденційності","settings":"Налаштування файлів cookie","unknown":"Додаткове сховище: вибір не зроблено (вимкнено)","yes":"Збереження мови: Згода","no":"Додаткове збереження: Відхилено","saved":"Ваш вибір збережено. Ви можете змінити його будь-коли в налаштуваннях файлів cookie.","temporary":"Цей браузер не може зберегти зміни. Ваш вибір буде застосовано лише тоді, коли ця сторінка відкрита."},"pl":{"title":"O korzystaniu z plików cookie","body":"Ta strona nie używa żadnych opcjonalnych plików cookie. Jedynym opcjonalnym zapisem jest ustawienie języka wyświetlania. Nic nie jest zapisywane bez Twojej zgody, a Ty nadal możesz przeglądać wszystkie treści, nawet jeśli jej nie wyrazisz. Nie używamy żadnych plików cookie do celów analitycznych ani reklamowych.","required":"Pliki cookie Cloudflare i dane komunikacyjne niezbędne do dostarczania i ochrony nie podlegają temu opcjonalnemu ustawieniu. Sam wybór zostanie zapisany w tej przeglądarce przez 180 dni.","reject":"odrzucenie","accept":"zgoda","policy":"Polityka prywatności","settings":"Ustawienia plików cookie","unknown":"Opcjonalne miejsce do przechowywania: brak wyboru (wyłączone)","yes":"Zachowanie języka: Zgoda","no":"Opcjonalny zapis: Odrzucono","saved":"Twój wybór został zapisany. Możesz go w każdej chwili zmienić w ustawieniach plików cookie.","temporary":"Ta przeglądarka nie może zapisać danych. Twój wybór zostanie zastosowany tylko wtedy, gdy ta strona będzie otwarta."},"sv":{"title":"Om användningen av cookies","body":"Den här webbplatsen använder inga valfria cookies. Den enda valfria sparningen är inställningen av visningsspråk. Ingenting sparas förrän du samtycker, och du kan fortfarande se allt innehåll även om du vägrar. Vi använder inga analys- eller annonscookies.","required":"Cloudflare-cookies och kommunikationsinformation som är nödvändig för leverans och skydd omfattas inte av denna valfria inställning. Själva valet sparas i denna webbläsare i 180 dagar.","reject":"avslag","accept":"samtycke","policy":"Integritetspolicy","settings":"Cookie-inställningar","unknown":"Valfri lagring: inget val gjort (inaktiverat)","yes":"Språkbevarande: Godkänt","no":"Valfritt sparande: Avvisad","saved":"Ditt val har sparats. Du kan ändra det när som helst i dina cookieinställningar.","temporary":"Den här webbläsaren kan inte spara. Ditt val kommer bara att tillämpas medan sidan är öppen."}};
  const requested = new URLSearchParams(location.search).get("lang") || document.documentElement.lang || navigator.language || "en";
  const code = requested.startsWith("zh") ? "zh" : requested.split("-")[0];
  const japanese = code === "ja";
  const copy = copies[code] || copies.en;
  function get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function remove(key) { try { localStorage.removeItem(key); } catch (_) { /* storage may be unavailable */ } }
  function put(key, value) { try { localStorage.setItem(key, value); return true; } catch (_) { return false; } }
  function readChoice() {
    try {
      const value = JSON.parse(get(KEY));
      const now = Date.now();
      if (value && value.version === VERSION && typeof value.preferences === 'boolean' &&
          Number.isFinite(value.updatedAt) && Number.isFinite(value.expiresAt) &&
          value.updatedAt <= now && value.expiresAt > now && value.expiresAt > value.updatedAt &&
          value.expiresAt <= value.updatedAt + LIFETIME) return value;
    } catch (_) { /* malformed or unavailable storage fails closed */ }
    remove(KEY);
    return null;
  }
  let choice = readChoice(), language = null, returnFocus = null;
  let persistent = !!choice;
  if (!choice || !choice.preferences) remove(LANGUAGE);

  const banner = document.createElement('section');
  banner.id = 'briefing-preferences'; banner.className = 'briefing-preferences';
  banner.setAttribute('role', 'region'); banner.setAttribute('aria-labelledby', 'privacy-title');
  const label = document.createElement('span'); label.className = 'preferences-label'; label.textContent = 'BRIEFING / PREFERENCES';
  const heading = document.createElement('h2'); heading.id = 'privacy-title'; heading.textContent = copy.title;
  const description = document.createElement('p'); description.textContent = copy.body;
  const detail = document.createElement('p'); detail.className = 'privacy-detail'; detail.textContent = copy.required;
  const policy = document.createElement('a'); policy.href = code === 'ja' ? '/privacypolicy/' : '/privacypolicy/index.' + (copies[code] ? code : 'en'); policy.textContent = copy.policy;
  const copyBlock = document.createElement('div'); copyBlock.className = 'privacy-copy';
  copyBlock.append(heading, description, detail, policy);
  const actions = document.createElement('div'); actions.className = 'privacy-actions';
  const reject = document.createElement('button'); reject.type = 'button'; reject.id = 'privacy-reject'; reject.textContent = copy.reject;
  const accept = document.createElement('button'); accept.type = 'button'; accept.id = 'privacy-accept'; accept.textContent = copy.accept;
  actions.append(reject, accept);
  const bar = document.createElement('div'); bar.className = 'privacy-bar'; bar.append(copyBlock, actions);
  banner.append(label, bar);
  const dock = document.createElement('nav'); dock.className = 'privacy-dock'; dock.setAttribute('aria-label', copy.policy);
  const policyLink = policy.cloneNode(true);
  const settings = document.createElement('button'); settings.type = 'button'; settings.id = 'privacy-settings';
  settings.setAttribute('aria-label', copy.settings); settings.title = copy.settings;
  const cookieIcon = document.createElement('span'); cookieIcon.className = 'privacy-cookie-icon'; cookieIcon.setAttribute('aria-hidden', 'true'); cookieIcon.textContent = '🍪';
  const settingsText = document.createElement('span'); settingsText.className = 'privacy-settings-text'; settingsText.textContent = copy.settings;
  settings.append(cookieIcon, settingsText);
  if (document.getElementById('app')) { document.body.classList.add('motion-page'); dock.classList.add('motion-privacy'); }
  settings.setAttribute('aria-controls', banner.id); settings.setAttribute('aria-expanded', 'false');
  dock.append(policyLink, settings);
  const status = document.createElement('p'); status.className = 'privacy-status'; status.setAttribute('role', 'status');
  document.body.append(dock, banner, status);

  function update() {
    const text = !choice ? copy.unknown : choice.preferences ? copy.yes : copy.no;
    document.querySelectorAll('[data-privacy-status]').forEach(el => { el.textContent = text; });
    settings.setAttribute('aria-expanded', String(!banner.hidden));
    dock.hidden = !banner.hidden;
  }
  function currentChoice() {
    if (choice && choice.expiresAt <= Date.now()) {
      choice = null; persistent = false; remove(KEY); remove(LANGUAGE); banner.hidden = false; update();
    }
    return choice;
  }
  function getLanguage() {
    const value = currentChoice();
    return value && value.preferences && persistent ? get(LANGUAGE) : null;
  }
  function setLanguage(code) {
    if (typeof code !== 'string' || !/^[a-z]{2}$/.test(code)) return;
    language = code;
    const value = currentChoice();
    if (value && value.preferences && persistent) put(LANGUAGE, code);
  }
  function showSettings() {
    currentChoice(); returnFocus = document.activeElement;
    banner.hidden = false; update(); reject.focus({ preventScroll: true });
  }
  function choose(preferences) {
    const now = Date.now();
    choice = { version: VERSION, preferences, updatedAt: now, expiresAt: now + LIFETIME };
    const persisted = persistent = put(KEY, JSON.stringify(choice));
    if (!persisted) { remove(KEY); remove(LANGUAGE); }
    if (preferences && persisted) {
      const select = document.getElementById('lang-select');
      const current = language || (select && select.value);
      if (current) setLanguage(current);
    } else remove(LANGUAGE);
    banner.hidden = true; update(); status.textContent = persisted ? copy.saved : copy.temporary;
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    else settings.focus({ preventScroll: true });
    window.dispatchEvent(new CustomEvent('privacychange', { detail: { preferences } }));
  }
  window.PRIVACY = Object.freeze({
    getLanguage, setLanguage, showSettings,
    getChoice() { const value = currentChoice(); return value ? value.preferences : null; }
  });
  reject.addEventListener('click', () => choose(false));
  accept.addEventListener('click', () => choose(true));
  settings.addEventListener('click', showSettings);
  document.querySelectorAll('[data-privacy-open]').forEach(el => el.addEventListener('click', showSettings));
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = readChoice(); persistent = !!choice;
    if (!choice || !choice.preferences) remove(LANGUAGE);
    banner.hidden = !!choice; update();
  });
  banner.hidden = !!choice; update();
})();
