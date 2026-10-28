// Compare complete drawing commands and JS-only timings; excludes raster/GPU work.
const fs = require('node:fs'), vm = require('node:vm'), crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {performance} = require('node:perf_hooks');
const baseline = process.argv[2] || '73e5e54';
function load(previous) {
  const scope = {window: {}};
  for (const file of ['data.js','rig3d.js','visuals.js']) vm.runInNewContext(previous
    ? execFileSync('git', ['show', `${baseline}:site/${file}`], {encoding:'utf8'})
    : fs.readFileSync('site/'+file,'utf8'), scope);
  return scope.window;
}
function canvas(record) {
  let next = 0;
  const methods = new Set(['arc','beginPath','closePath','fill','fillRect','fillText','lineTo','moveTo',
    'restore','save','setLineDash','stroke','clearRect','clip','rect','translate']);
  return new Proxy({}, {
    get(target, key) {
      if (key === 'measureText') return text => ({width:String(text).length*6});
      if (key === 'createRadialGradient') return (...args) => {
        const id = ++next; record?.push([key,id,...args]);
        return {gradient:id, addColorStop(...stops) {record?.push(['stop',id,...stops]);}};
      };
      if (methods.has(key)) return (...args) => {record?.push([key,...args]);};
      return target[key];
    },
    set(target, key, value) {target[key]=value;record?.push(['set',key,value?.gradient?{gradient:value.gradient}:value]);return true;}
  });
}
const previous = load(true), current = load(false);
let samples = 0, commands = 0;
for (const scene of current.CONTENT.scenes) for (const [width,height,time,yaw,pitch] of
  [[960,700,0,0,0],[390,520,4,.4,.1],[1440,700,7,-.6,-.1],[844,280,4,.8,.2]]) {
  const traces=[];
  for (const runtime of [previous,current]) {
    const record=[];
    runtime.VISUALS.setTilt(yaw,pitch);runtime.VISUALS.setOrbit(.12);
    runtime.VISUALS.draw(scene.visual,canvas(record),width,height,time,false,0,0);
    traces.push(JSON.stringify(record));
  }
  if (traces[0]!==traces[1]) throw Error('Drawing command mismatch: '+scene.id+' '+width+'x'+height);
  commands += JSON.parse(traces[0]).length; samples++;
}
const rows=[];
for (const id of ['intro','npm','tailworm-overview','morning-consul-identity','closing']) {
  const scene = current.CONTENT.scenes.find(item=>item.id===id);
  const timing=[];
  for (const runtime of [previous,current]) {
    const ctx=canvas();runtime.VISUALS.setTilt(.4,.1);runtime.VISUALS.setOrbit(.12);
    for(let i=0;i<20;i++)runtime.VISUALS.draw(scene.visual,ctx,960,700,4+i/30,false,0,0);
    const rounds=[];
    for(let j=0;j<5;j++) {
      const start=performance.now();
      for(let i=0;i<60;i++)runtime.VISUALS.draw(scene.visual,ctx,960,700,4+i/30,false,0,0);
      rounds.push((performance.now()-start)/60);
    }
    timing.push(rounds.sort((a,b)=>a-b)[2]);
  }
  rows.push({scene:id,beforeMs:+timing[0].toFixed(3),afterMs:+timing[1].toFixed(3),improvementPercent:+((1-timing[1]/timing[0])*100).toFixed(1)});
}
console.log(JSON.stringify({baseline,samples,commands,identical:true,jsOnly:true,timings:rows},null,2));
