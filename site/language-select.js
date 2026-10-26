/* Native selects navigate only to actual pages hosted by this site. */
(function () {
  'use strict';
  for (const select of document.querySelectorAll('select[data-language-navigation]')) {
    function sync() { for (const option of select.options) option.selected=option.defaultSelected; }
    window.addEventListener('pageshow',sync);
    select.addEventListener('change',()=>{
      const option=select.selectedOptions[0];if(!option||!option.value)return;
      const target=new URL(option.value,location.href);
      if(target.origin!==location.origin)return;
      try { window.PRIVACY?.setLanguage(option.dataset.code); } catch (_) { /* Navigation remains available. */ }
      location.assign(target.href);
    });
  }
})();
