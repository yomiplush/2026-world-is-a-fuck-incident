/* Searchable progressive enhancement: no Google requests until an external link is chosen. */
(function () {
  'use strict';
  const core=window.LANGUAGE_CORE;
  if (!core || !window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) return;
  let ja=document.documentElement.lang.startsWith('ja');
  const jaCopy={
    title:'言語を選ぶ',close:'閉じる',search:'言語を検索',hint:'日本語名・英語名・現地語名・言語コード',site:'サイト内の表示',google:'Google翻訳',loading:'言語一覧を読み込んでいます…',empty:'一致する言語がありません。',
    note:'Google翻訳は別タブで開き、選んだページのURLをGoogleへ送ります。自動翻訳のため、製品名・版・対策は原文と照合してください。',motion:'モーションの翻訳は、全画面の文章を読めるページで開きます。Canvas上の文字は翻訳されません。',fallback:'すべての言語・翻訳について',ready:'言語',external:'Google翻訳で開く',native:'サイト内で表示',error:'一覧を読み込めませんでした。言語一覧ページをご利用ください。'
  };
  const enCopy={title:'Choose a language',close:'Close',search:'Search languages',hint:'Name, native name or language code',site:'On-site display',google:'Google Translate',loading:'Loading languages…',empty:'No matching languages.',note:'Google Translate opens in another tab and receives the selected page URL. Automatic translations may contain errors; check product names, versions and actions against the original.',motion:'Motion text opens as a readable transcript. Canvas labels cannot be translated by Google.',fallback:'All languages and translation information',ready:'Languages',external:'Open in Google Translate',native:'Display on this site',error:'The list could not be loaded. Please use the language directory.'};
  let text=ja?jaCopy:enCopy;
  let catalog=null,pending=null,mode='site',opener=null;
  const dialog=document.createElement('dialog');dialog.id='language-dialog';dialog.className='language-dialog';dialog.setAttribute('aria-labelledby','language-title');dialog.setAttribute('translate','no');
  dialog.innerHTML='<header><h2 id="language-title"></h2><button type="button" class="language-close"></button></header><label for="language-search"></label><input id="language-search" type="search" autocomplete="off" spellcheck="false"><div class="language-modes"><button type="button" data-mode="site"></button><button type="button" data-mode="google"></button></div><p class="language-status" role="status" aria-live="polite"></p><div class="language-results"></div><footer><p class="language-note"></p><p class="language-motion-note"></p><a href="/languages"></a></footer>';
  const find=s=>dialog.querySelector(s),search=find('input'),results=find('.language-results'),status=find('.language-status');
  function labels(){
    ja=document.documentElement.lang.startsWith('ja');text=ja?jaCopy:enCopy;
  find('h2').textContent=text.title;find('.language-close').textContent=text.close;find('label').textContent=text.search;search.placeholder=text.hint;
  find('[data-mode=site]').textContent=text.site;find('[data-mode=google]').textContent=text.google;
  find('.language-note').textContent=text.note;find('.language-motion-note').textContent=text.motion;find('footer a').textContent=text.fallback;
  }
  labels();
  document.body.appendChild(dialog);
  function notify(){window.dispatchEvent(new Event('briefinglanguagepanelchange'));}
  function source(){const canonical=document.querySelector('link[rel=canonical]');return core.readingURL(canonical?canonical.href:'https://www.infosec-briefing.net/',location.href);}
  function isMotion(){return document.querySelector('link[rel=canonical]')?.href==='https://www.infosec-briefing.net/';}
  function localRows(){
    if(!catalog)return[];
    if(document.getElementById('lang-select'))return catalog.local;
    if(/^\/briefing(?:\.en)?(?:\.html)?$/.test(location.pathname))return catalog.local.filter(r=>r.code==='ja'||r.code==='en');
    return catalog.local.filter(r=>r.code===document.documentElement.lang.split('-')[0]);
  }
  function current(){const select=document.getElementById('lang-select');if(isMotion()&&!window.__booted)return new URLSearchParams(location.search).get('lang')||select?.value||'en';return select?select.value:document.documentElement.lang.split('-')[0];}
  function selectLocal(code){
    if(isMotion()&&!window.__booted){
      try{if(window.PRIVACY)window.PRIVACY.setLanguage(code);}catch(_){/* Optional preference storage. */}
      const url=new URL(location.href);url.searchParams.set('lang',code);location.assign(url.href);return;
    }
    const select=document.getElementById('lang-select');
    if(!select){
      if(/^\/briefing(?:\.en)?(?:\.html)?$/.test(location.pathname)&&['ja','en'].includes(code))location.assign('/briefing'+(code==='en'?'.en':'')+location.hash);
      return;
    }
    if(select.disabled)return;
    dialog.close();select.value=code;select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function render(){
    for(const button of dialog.querySelectorAll('[data-mode]'))button.setAttribute('aria-pressed',String(button.dataset.mode===mode));
    find('.language-note').hidden=mode!=='google';find('.language-motion-note').hidden=mode!=='google'||!isMotion();
    results.replaceChildren();
    if(!catalog){status.textContent=text.loading;return;}
    const rows=core.filter(mode==='site'?localRows():catalog.languages,search.value);
    status.textContent=rows.length+' / '+(mode==='site'?localRows().length:catalog.languages.length);
    if(!rows.length){status.textContent=text.empty;return;}
    const fragment=document.createDocumentFragment();
    for(const row of rows){
      const item=document.createElement(mode==='site'?'button':'a');item.className='language-option';item.dataset.code=row.code;
      if(mode==='site'){
        item.type='button';item.setAttribute('aria-pressed',String(row.code===current()));item.addEventListener('click',()=>selectLocal(row.code));
      }else{
        item.href=core.translationURL(row.code,source());item.target='_blank';item.rel='noopener noreferrer';
        item.setAttribute('aria-label',row.en+' · '+text.external);
      }
      const name=document.createElement('bdi');name.dir='auto';name.textContent=row.native||row.en;
      const detail=document.createElement('small');detail.textContent=[ja?row.ja:row.en,row.code].filter(Boolean).join(' · ');
      item.append(name,detail);fragment.appendChild(item);
    }
    results.appendChild(fragment);
  }
  function load(){
    if(pending)return pending;
    pending=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='/language-catalog.js?v=20261026all';
      script.onload=()=>{if(!window.LANGUAGE_CATALOG){pending=null;reject(new Error('Missing catalog'));return;}
        catalog=window.LANGUAGE_CATALOG;
        for(const row of catalog.languages){
          try{if(Intl.DisplayNames && Intl.DisplayNames.supportedLocalesOf([row.code]).length)row.native=new Intl.DisplayNames([row.code],{type:'language'}).of(row.code);}catch(_){/* Google codes can be non-BCP47. */}
        }
        resolve();};
      script.onerror=()=>{script.remove();pending=null;reject(new Error('Catalog failed'));};document.head.appendChild(script);
    });return pending;
  }
  function viewport(){
    const view=window.visualViewport;
    dialog.style.setProperty('--language-height',(view?view.height:window.innerHeight)+'px');
    dialog.style.setProperty('--language-top',((view?view.offsetTop:0)+12)+'px');
  }
  function open(button,initial){
    if(dialog.open)return;
    labels();opener=button;mode=initial||(document.getElementById('lang-select')?'site':'google');search.value='';
    render();viewport();dialog.showModal();notify();search.focus();
    window.addEventListener('resize',viewport,{passive:true});
    if(window.visualViewport){visualViewport.addEventListener('resize',viewport,{passive:true});visualViewport.addEventListener('scroll',viewport,{passive:true});}
    load().then(render).catch(()=>{status.textContent=text.error;});
  }
  for(const anchor of document.querySelectorAll('a[data-language-picker]'))anchor.addEventListener('click',event=>{event.preventDefault();open(anchor);});
  const select=document.getElementById('lang-select');
  if(select){
    const button=document.createElement('button');button.type='button';button.className='language-picker-button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',dialog.id);
    function sync(){const option=select.selectedOptions[0];button.textContent=(option?option.textContent:text.ready)+' ▾';button.disabled=select.disabled;button.setAttribute('aria-label',(document.documentElement.lang.startsWith('ja')?jaCopy.title:enCopy.title)+': '+(option?option.textContent:text.ready));}
    // Keep the native select as a visible fallback unless enhancement is ready.
    select.insertAdjacentElement('afterend',button);select.classList.add('language-select-enhanced');
    const caret=select.parentElement.querySelector('.caret');if(caret)caret.hidden=true;
    new MutationObserver(sync).observe(select,{childList:true,attributes:true,attributeFilter:['disabled']});
    new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    select.addEventListener('change',()=>setTimeout(sync,0));window.addEventListener('pageshow',sync);button.addEventListener('click',()=>open(button));sync();
  }
  dialog.addEventListener('close',()=>{window.removeEventListener('resize',viewport);if(window.visualViewport){visualViewport.removeEventListener('resize',viewport);visualViewport.removeEventListener('scroll',viewport);}notify();if(opener&&opener.isConnected)opener.focus();});
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  find('.language-close').addEventListener('click',()=>dialog.close());
  for(const button of dialog.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{mode=button.dataset.mode;render();search.focus();});
  search.addEventListener('input',render);
  // Native dialog handles Escape, focus trapping and page inertness.
  window.LANGUAGE_PICKER={open:()=>open(select?.nextElementSibling||null),ready:true};
})();
