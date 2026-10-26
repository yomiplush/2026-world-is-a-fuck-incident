const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const test=require('node:test');
const script=fs.readFileSync('site/browser-ui.js','utf8');
async function detect(navigator,search=''){
 const root={dataset:{}},events=[];
 vm.runInNewContext(script,{navigator,location:{search},URLSearchParams,document:{documentElement:root},window:{dispatchEvent:e=>events.push(e.type)},Event:class{constructor(type){this.type=type}}});
 await new Promise(resolve=>setImmediate(resolve));
 return {browser:root.dataset.browser,events};
}
test('explicit Brave API enables compatibility and signals one reflow',async()=>{
 assert.deepEqual(await detect({brave:{isBrave:async()=>true}}),{browser:'brave',events:['briefingviewportchange']});
});
test('explicit compatibility link works when browser identity is unavailable',async()=>{
 assert.deepEqual(await detect({},'?ui=brave'),{browser:'brave',events:['briefingviewportchange']});
});
test('Brave brand and API together still trigger only one reflow',async()=>{
 assert.deepEqual(await detect({userAgentData:{brands:[{brand:'Brave'}]},brave:{isBrave:async()=>true}}),{browser:'brave',events:['briefingviewportchange']});
});
test('Chromium shared UA and other browsers keep the existing layout',async()=>{
 for(const navigator of [{},{userAgent:'Chrome/150',userAgentData:{brands:[{brand:'Chromium'}]}},{brave:{isBrave:async()=>false}}]){
  assert.deepEqual(await detect(navigator),{browser:undefined,events:[]});
 }
});
test('blocked identity API degrades safely without an unhandled rejection',async()=>{
 for(const isBrave of [()=>{throw Error('blocked')},async()=>{throw Error('blocked')}]){
  assert.deepEqual(await detect({brave:{isBrave}}),{browser:undefined,events:[]});
 }
});
