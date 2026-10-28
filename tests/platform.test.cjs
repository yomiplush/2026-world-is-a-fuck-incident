const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm');
function platform(window) {
 Object.assign(window,{Promise,Map,URL,URLSearchParams,CSS:{supports(){return true}},requestAnimationFrame(){},cancelAnimationFrame(){}});
  vm.runInNewContext(fs.readFileSync('site/platform.js','utf8'),{window,navigator:{language:'ja'},document:{createElement:()=>({getContext(){}})}});
  return window.PLATFORM;
}
test('media settings support old Safari listeners and release them',()=>{
 let listener, removed;
 const query={matches:false,addListener(fn){listener=fn},removeListener(fn){removed=fn}};
 const p=platform({matchMedia:()=>query});let changes=0;
 const stop=p.watchMedia(p.media('(prefers-reduced-motion: reduce)'),()=>changes++);
 listener({matches:true});assert.equal(changes,1);stop();assert.equal(removed,listener);
});
test('missing optional media APIs choose conservative motion without throwing',()=>{
 const p=platform({});assert.equal(p.media('(prefers-reduced-motion: reduce)').matches,true);
 assert.doesNotThrow(()=>p.watchMedia(p.media('(min-width: 900px)'),()=>{})());
});
test('Web Audio constructor failures never block entry or navigation',()=>{
 const scope={window:{AudioContext:function(){throw new Error('audio disabled')}},document:{hidden:false}};
 vm.runInNewContext(fs.readFileSync('site/audio.js','utf8'),scope);
 assert.doesNotThrow(()=>scope.window.AUDIO.init());
 assert.equal(scope.window.AUDIO.ready,false);
 assert.doesNotThrow(()=>scope.window.AUDIO.sfx('blip'));
});
test('viewport bursts coalesce and unchanged measurements produce no style writes or layout events',()=>{
 const events={}, jobs=[], writes=[], dispatched=[];
 const viewport={height:700,offsetTop:0,scale:1,addEventListener(name,fn){events['v'+name]=fn}};
 const window={visualViewport:viewport,innerHeight:700,addEventListener(name,fn){events[name]=fn},dispatchEvent(event){dispatched.push(event)}};
 const scope={window,document:{documentElement:{style:{setProperty(...args){writes.push(args)}},classList:{toggle(){}}}},Event:class{constructor(type){this.type=type}},requestAnimationFrame:fn=>{jobs.push(fn);return jobs.length}};
 vm.runInNewContext(fs.readFileSync('site/viewport.js','utf8'),scope);
 assert.equal(dispatched.length,1);writes.length=0;dispatched.length=0;
 for(let i=0;i<100;i++)events.vscroll();
 assert.equal(jobs.length,1);jobs.shift()();
 assert.equal(writes.length,0);assert.equal(dispatched.length,0);
 viewport.height=480;events.vresize();events.resize();assert.equal(jobs.length,1);jobs.shift()();
 assert.equal(dispatched.length,1);assert.equal(writes.length,3);
 viewport.scale=2;events.vscroll();jobs.shift()();assert.equal(dispatched.length,1);
});
test('limited devices allocate smaller reverb buffers and support legacy void audio promises',()=>{
 function samples(hints){
  const allocated=[];
  const node=()=>({connect(){},gain:{value:0,setTargetAtTime(){}}});
  class Context{
   constructor(){this.sampleRate=48000;this.destination={};this.currentTime=0;}
   createDynamicsCompressor(){return {connect(){},threshold:{},knee:{},ratio:{},attack:{},release:{}};}
   createGain(){return node();}createConvolver(){return node();}createMediaElementSource(){return node();}
   createBuffer(channels,length){allocated.push(channels*length);return {getChannelData(){return new Float32Array(length);}};}
   resume(){}suspend(){}close(){}
  }
  class Track{constructor(){this.paused=true;}canPlayType(){return '';}play(){this.paused=false;}pause(){this.paused=true;}removeAttribute(){}load(){}}
  const scope={window:{navigator:hints,AudioContext:Context},Audio:Track,document:{hidden:false}};
  vm.runInNewContext(fs.readFileSync('site/audio.js','utf8'),scope);scope.window.AUDIO.init();
  assert.equal(scope.window.AUDIO.ready,true);assert.doesNotThrow(()=>scope.window.AUDIO.dispose());
  return allocated.reduce((a,b)=>a+b,0);
 }
 const normal=samples({hardwareConcurrency:8,deviceMemory:8});
 const limited=samples({hardwareConcurrency:2,deviceMemory:2});
 assert.equal(normal,230400);assert.equal(limited,36000);
 assert.ok(limited<normal*.16);
});
