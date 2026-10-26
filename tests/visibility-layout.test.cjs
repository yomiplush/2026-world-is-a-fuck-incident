const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('path').join(__dirname,'../site/app.js'),'utf8');
const resize=source.slice(source.indexOf('  function resize() {'),source.indexOf('  window.addEventListener("resize", resize'));
const visible=source.slice(source.lastIndexOf('  document.addEventListener("visibilitychange",'),source.lastIndexOf('  window.addEventListener("pagehide",'));
let measures=0,callback,visibleHandler;
const s={layoutFrame:0,document:{hidden:false,addEventListener:(name,fn)=>visibleHandler=fn},requestAnimationFrame:fn=>{callback=fn;return 1},cancelAnimationFrame:()=>callback=null,measureLayout:()=>measures++,renderer:{invalidate(){}},performance:{now:()=>100},last:0,syncRuntime(){},A:{},pendingAdvance:0,lastTap:0,endDrag(){},clearTimeout(){}};
vm.createContext(s);vm.runInContext(resize+visible,s);
s.resize();{const fn=callback;callback=null;fn();}assert.equal(measures,1);
s.document.hidden=true;visibleHandler();s.resize();s.document.hidden=false;visibleHandler();if(callback){const fn=callback;callback=null;fn();}
console.log({layoutMeasurements:measures,expectedAfterHiddenResizeAndResume:2});
assert.equal(measures,2,'returning to visibility must refresh layout after hidden resizes');
