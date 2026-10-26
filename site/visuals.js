/* Motion briefing: 31 purpose-built 3D compositions for all 34 scenes.
   Contract: draw(visual, ctx, w, h, seconds, reduced, ox, oy [, viewport]).
   World geometry always goes through RIG3D; camera gestures remain real 3D.
   Animation is explanatory and deterministic, never live incident telemetry. */
window.VISUALS = (function () {
  'use strict';
  const R = window.RIG3D, C = R.C, A = R.a, TAU = R.TAU;
  const scenes = Object.create(null);
  const ease = v => 1 - Math.pow(1 - R.clamp(v, 0, 1), 3);
  const enter = (t, delay = 0, duration = .85) => ease((t - delay) / duration);
  const phase = (t, speed = .22, offset = 0) => ((t * speed + offset) % 1 + 1) % 1;
  const lerp = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

  function stage(ctx, w, h, t, options = {}) {
    const e = enter(t);
    const camera = R.cam(t, { pitch: 0.52, yaw: .22, pitchMin: 0.3,
      ...options, dist: (options.dist || 1000) + (1 - e) * 180 });
    const g = R.rig(ctx, camera, w, h);
    // A restrained instrument deck gives solids scale and grounded shadows.
    g.prism(0, 330, 0, 545, 8, 6, C.steel, { alpha: .16, edge: .20, rot: Math.PI / 6 });
    g.loop([0, 320, 0], 490, A(C.cyan, .12), { seg: 48, width: .8 });
    for (let i = -2; i <= 2; i++) {
      g.beam([-520, 320, i * 160], [520, 320, i * 160], A(C.cyan, .055), { width: .6, core: false });
      g.beam([i * 200, 320, -360], [i * 200, 320, 360], A(C.cyan, .055), { width: .6, core: false });
    }
    return g;
  }
  function label(g, p, text, tone = C.ink, size = 11, o = {}) {
    g.label(p, text, tone, size, { plate: true, ...o });
  }
  function heading(g, text, tone = C.steel) {
    label(g, [0, -350, 0], text, tone, 11, { priority: 2 });
  }
  function node(g, p, text, tone, t, i = 0, shape = {}) {
    const e = enter(t, i * .055);
    const [x, y, z] = p, hx = shape.hx || 60, hy = shape.hy || 42, hz = shape.hz || 42;
    // A dark machined body, luminous front inset and a separate plinth.
    g.box(x, y + hy + 12, z, hx + 10, 5, hz + 8, C.steel, { alpha: .42, edge: .24 });
    g.box(x, y + (1 - e) * 65, z, hx, Math.max(1, hy * e), hz, tone, { alpha: .88, edge: .65 });
    g.box(x - hx + 7, y, z - hz - 1, 2, Math.max(1, (hy - 8) * e), 1, tone, { alpha: .9, flat: true });
    for (let j = 0; j < 3; j++) g.beam([x + hx - 20, y - 20 + j * 12, z - hz - 2],
      [x + hx - 8, y - 20 + j * 12, z - hz - 2], A(tone, .6), { width: 1.3, core: false });
    if (text) label(g, [x, y - hy - 36, z], text, tone, shape.font || 11);
  }
  function wire(g, a, b, tone = C.cyan, width = 1.2) {
    g.beam(a, b, A(tone, .26), { width, core: false });
  }
  function flow(g, a, b, t, tone = C.cyan, offset = 0, speed = .22) {
    wire(g, a, b, tone);
    const k = phase(t, speed, offset);
    const tail = lerp(a, b, Math.max(0, k - .12)), head = lerp(a, b, k);
    g.beam(tail, head, A(tone, .75), { width: 2.2 });
    g.dot(head, 2.7, tone, { alpha: .9 });
  }
  function curve(g, a, b, t, tone, offset = 0, lift = 85) {
    const at = k => { const p = lerp(a, b, k); p[1] -= Math.sin(k * Math.PI) * lift; return p; };
    for (let i = 0; i < 12; i++) wire(g, at(i / 12), at((i + 1) / 12), tone);
    g.dot(at(phase(t, .2, offset)), 3, tone, { alpha: .9 });
  }
  function ring(g, p, r, tone = C.cyan, plane = 'xz') {
    g.loop(p, r, A(tone, .6), { plane, width: 1.2, seg: 48 });
  }
  function gate(g, p, tone, text) {
    g.box(...p, 9, 94, 80, tone, { alpha: .35, edge: .85, glow: true });
    for (let i = -2; i <= 2; i++) wire(g, [p[0] - 10, p[1] + i * 32, p[2] - 72], [p[0] - 10, p[1] + i * 32, p[2] + 72], tone);
    if (text) label(g, [p[0], p[1] - 128, p[2]], text, tone, 10);
  }
  function tick(g, p, tone = C.green, cross = false) {
    const [x,y,z] = p;
    if (cross) {
      g.beam([x-7,y-7,z],[x+7,y+7,z],tone,{width:2});
      g.beam([x+7,y-7,z],[x-7,y+7,z],tone,{width:2});
    } else {
      g.beam([x-9,y,z],[x-2,y+7,z],tone,{width:2});
      g.beam([x-2,y+7,z],[x+12,y-10,z],tone,{width:2});
    }
  }

  scenes.radar = (ctx,w,h,t) => {
    const g = stage(ctx,w,h,t,{pitch: 0.56,yaw:.16,pitchMin: 0.3});
    const y = 80, r = 425;
    g.prism(0,180,0,150,55,8,C.steel,{alpha:.65,edge:.35});
    g.prism(0,110,0,r+20,12,64,C.cyan,{alpha:.3,edge:.5});
    for(let i=1;i<=4;i++) ring(g,[0,y,0],r*i/4,C.cyan);
    for(let i=0;i<12;i++) {
      const a=i*TAU/12;
      wire(g,[Math.cos(a)*r*.15,y,Math.sin(a)*r*.15],[Math.cos(a)*r,y,Math.sin(a)*r],C.cyan);
    }
    const a=t*.48;
    for(let i=0;i<12;i++)g.band([0,y-2,0],0,r,a-i*.035,a-(i+1)*.035,C.green,{seg:1,alpha:(1-i/12)*.17});
    g.beam([0,y-4,0],[Math.cos(a)*r,y-4,Math.sin(a)*r],C.green,{width:2});
    for(let i=0;i<5;i++) {
      const ang=i*2.399, rad=150+i*43;
      const p=[Math.cos(ang)*rad,y-18,Math.sin(ang)*rad];
      g.octa(...p,8,i===2?C.amber:C.cyan,{alpha:.8});
      wire(g,p,[p[0],y-95,p[2]],C.cyan);
    }
    heading(g,'OCTOBER 2026 / INCIDENT BRIEFING',C.cyan);
    label(g,[0,265,260],'DISCLOSURE → EXPOSURE → RESPONSE',C.steel,10);
    g.flush();
  };

  scenes.timeline = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{yaw:.08,pitch: 0.52});
    const marks=o.marks||[], n=marks.length;
    wire(g,[-500,200,0],[500,200,0],C.amber,3);
    marks.forEach((name,i)=>{
      const x=-470+i*940/Math.max(1,n-1), e=enter(t,i*.12);
      g.box(x,200-115*e,0,3,115*e+1,3,i===n-1?C.green:C.amber,{alpha:.9});
      node(g,[x,-65,-10],null,i===n-1?C.green:C.cyan,t,i,{hx:38,hy:22,hz:28});
      label(g,[x,-135,0],name,i===n-1?C.green:C.ink,12);
      if(i<n-1)flow(g,[x,200,0],[x+940/Math.max(1,n-1),200,0],t,C.amber,i*.23);
    });
    heading(g,'DISCLOSURE TIMELINE');
    label(g,[-240,270,0],'SILENCE',C.amber,11); label(g,[470,270,0],'PUBLIC',C.green,11);
    g.flush();
  };

  scenes.grid = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.62,yaw:-.12,pitchMin: 0.34});
    const cols=o.cols||9, rows=o.rows||5, gap=86, hot=new Set(o.hot||[]);
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++) {
      const i=row*cols+col, hit=hot.has(i), x=(col-(cols-1)/2)*gap, z=(row-(rows-1)/2)*gap;
      const rise=enter(t,(row+col)*.025), height=hit?105+12*Math.sin(t*1.4+i):22;
      g.box(x,140-height*rise/2,z,28,Math.max(1,height*rise/2),28,hit?C.red:C.cyan,{alpha:hit?.92:.46,edge:hit?.9:.3});
      if(hit) { g.octa(x,110-height,z,7,C.red,{alpha:.9});wire(g,[x,140-height,z],[x,-110-height,z],C.red); }
    }
    // A scan plane shows an inspection, not new infections appearing over time.
    const z=-rows*gap/2+phase(t,.12)*rows*gap;
    g.beam([-cols*gap/2,152,z],[cols*gap/2,152,z],A(C.cyan,.65),{width:1.6});
    heading(g,'DEPENDENCY INSPECTION',C.cyan);
    label(g,[0,260,260],`${cols*rows} CELLS / ${hot.size} HIGHLIGHTED`,C.steel,10);
    g.flush();
  };

  scenes.fanout = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.18});
    const hub=[0,-90,0], n=o.nodes||14;
    node(g,hub,'CUSTOMER DB',C.amber,t,0,{hx:95,hy:58,hz:66});
    ring(g,[0,145,0],410,C.cyan);
    for(let i=0;i<n;i++) {
      const a=i*TAU/n, p=[Math.cos(a)*430,130,Math.sin(a)*350];
      node(g,p,null,C.cyan,t,i,{hx:19,hy:22,hz:19});
      curve(g,hub,p,t,C.cyan,i/n,65);
    }
    heading(g,'ONE DATABASE / MANY DEPENDENCIES');
    g.flush();
  };

  scenes.keys = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.12});
    const n=o.count||8, weak=o.weakIndex==null?3:o.weakIndex;
    for(let i=0;i<n;i++) {
      const x=(i-(n-1)/2)*128, y=i===weak?30:0, tone=i===weak?C.red:C.cyan;
      ring(g,[x,y-60,0],27,tone,'xy');
      g.box(x,y+5,0,9,42,12,tone,{alpha:.9,edge:.8});
      for(let j=0;j<2;j++)g.box(x+16,y+15+j*19,0,12,5,12,tone,{alpha:.9});
      label(g,[x,150,0],i===weak?'WEAK':`CA-${i+1}`,tone,10);
      wire(g,[x,-145,0],[x,y-90,0],C.steel);
      if(i===weak) {tick(g,[x,y-60,-30],C.red,true); ring(g,[x,20,0],68+8*Math.sin(t*1.2),C.red,'xy');}
    }
    wire(g,[-500,-145,0],[500,-145,0],C.steel);
    heading(g,'ONE WEAK KEY / SHARED TRUST',C.amber);
    g.flush();
  };

  scenes.ladder = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:-.18});
    const steps=o.steps||[], n=steps.length, gap=Math.min(240,920/Math.max(1,n-1));
    steps.forEach((name,i)=>{
      const x=(i-(n-1)/2)*gap, y=190-i*52, z=(i-(n-1)/2)*24, tone=i===o.hot?C.amber:C.cyan;
      g.box(x,y,z,Math.min(88,gap*.4),14+enter(t,i*.06)*4,60,tone,{alpha:.85,edge:.65});
      label(g,[x,y-64,z],name,tone,11);
      wire(g,[x,y+18,z],[x,290,z],C.steel);
      if(i<n-1)flow(g,[x,y,z],[x+gap,y-52,z+24],t,C.green,i*.12);
    });
    heading(g,'RELEASE LINES / VERSION HISTORY');
    g.flush();
  };

  scenes.matrix = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.62,yaw:-.25,pitchMin: 0.34});
    const cols=o.cols||11, rows=o.rows||5, n=cols*rows;
    for(let i=0;i<n;i++) {
      const x=(i%cols-(cols-1)/2)*75,z=(Math.floor(i/cols)-(rows-1)/2)*80;
      const on=enter(t,i*.009), last=i===n-1, tone=last&&o.swap?C.green:C.amber;
      g.box(x,130-on*24,z,27,8+on*16,27,tone,{alpha:.35+on*.45,edge:.5});
    }
    heading(g,'PATCH MATRIX / VERIFY THE EXACT BUILD',C.cyan);
    if(o.swap) {
      label(g,[-235,270,220],'AFFECTED 21.0.12.1',C.red,11);
      label(g,[235,270,220],'FIXED 21.0.13',C.green,11);
    }
    g.flush();
  };

  scenes.chain = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.08});
    const nodes=o.nodes||[], n=nodes.length;
    const pts=nodes.map((_,i)=>[(i-(n-1)/2)*230,(i%2?70:-40),0]);
    pts.forEach((p,i)=>{
      node(g,p,nodes[i],i===n-1?C.amber:C.cyan,t,i,{hx:50,hy:45,hz:45});
      label(g,[p[0],p[1]+100,0],String(i+1).padStart(2,'0'),C.steel,10);
      if(i<n-1)flow(g,p,pts[i+1],t,C.red,i*.14,.3);
    });
    heading(g,'CAPABILITY CHAIN',C.red);
    if(o.deadline)label(g,[460,240,0],'DUE 10-23',C.red,12);
    g.flush();
  };

  scenes.clock = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.15});
    const r=270, centre=[-120,-10,0];
    g.prism(...centre,r+30,24,64,C.cyan,{alpha:.5,edge:.5,axis:'z'});
    ring(g,[-120,-10,-28],r,C.cyan,'xy');
    for(let i=0;i<24;i++) {
      const a=i*TAU/24, r0=i%6===0?r-30:r-12;
      g.beam([-120+Math.cos(a)*r0,-10+Math.sin(a)*r0,-30],[-120+Math.cos(a)*r,-10+Math.sin(a)*r,-30],A(C.cyan,.6),{width:1,core:false});
    }
    const a=-Math.PI/2+phase(t,.035)*TAU;
    g.beam([-120,-10,-35],[-120+Math.cos(a)*(r-40),-10+Math.sin(a)*(r-40),-35],C.amber,{width:2});
    g.dot([-120,-10,-36],5,C.amber);
    label(g,[-120,75,-40],'6h17m',C.red,29,{bold:true,priority:1});
    (o.marks||[]).forEach((m,i)=>{
      const p=[360,-165+i*145,0];node(g,p,m[0],i===0?C.red:C.green,t,i,{hx:55,hy:20,hz:25});
      const angle=-Math.PI/2+m[1]*TAU;
      const mark=[-120+Math.cos(angle)*r,-10+Math.sin(angle)*r,-32];
      g.dot(mark,4,i===0?C.red:C.green,{alpha:.9});
      wire(g,mark,p,i===0?C.red:C.green);
    });
    heading(g,'THE EXPOSURE WINDOW',C.red);g.flush();
  };

  scenes.packages = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.12});
    const hub=[0,-80,0], items=o.items||[];
    node(g,hub,'CREDENTIALS',C.amber,t,0,{hx:85,hy:50,hz:60});
    ring(g,[0,160,0],410,C.red);
    items.forEach((name,i)=>{
      const a=i*TAU/items.length-.4, p=[Math.cos(a)*440,100,Math.sin(a)*320];
      node(g,p,name,C.cyan,t,i,{hx:43,hy:23,hz:30,font:10});
      // Compromised packages can collect a shared secret.
      curve(g,p,hub,t,C.red,i/items.length,40);
    });
    heading(g,'PACKAGE TRUST / SHARED SECRETS',C.amber);g.flush();
  };

  scenes.pillars = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.14});
    ['RAILWAY','ZEABUR','OPENCODE'].forEach((name,i)=>{
      const x=(i-1)*330;
      node(g,[x,95,0],name,C.cyan,t,i,{hx:90,hy:125,hz:65});
      for(let j=0;j<4;j++)g.box(x,10+j*50,-68,65,13,3,C.cyan,{alpha:.2,edge:.2});
      flow(g,[x,-230,0],[x,150,0],t,C.amber,i*.23);
      wire(g,[x,-230,0],[0,-230,0],C.amber);
    });
    heading(g,'AI PROVIDER KEYS',C.amber);g.flush();
  };

  scenes.dns = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.18});
    const core=[0,-10,0];
    node(g,core,'named / GSS-TSIG',C.amber,t,0,{hx:95,hy:68,hz:68});
    const n=o.clients||7;
    for(let i=0;i<n;i++) {
      const a=i*TAU/n, p=[Math.cos(a)*430,130,Math.sin(a)*330];
      node(g,p,null,C.steel,t,i,{hx:24,hy:26,hz:25});
      flow(g,p,core,t,i%2?C.red:C.cyan,i/n,.35);
    }
    ring(g,[0,100,0],170+phase(t,.2)*65,C.red);
    heading(g,'QUERY REPLAY → MEMORY CORRUPTION',C.red);g.flush();
  };

  scenes.leak = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.12});
    const ids=o.ids||[];
    g.box(-420,0,0,12,270,65,C.cyan,{alpha:.5});
    g.box(420,0,0,12,270,65,C.red,{alpha:.5});
    ids.forEach((id,i)=>{
      const y=-225+i*90;
      flow(g,[-405,y,0],[405,y,0],t,C.red,i*.13,.25);
      label(g,[0,y-25,0],'ZDI-CAN-'+id,C.ink,11);
      g.octa(420,y,-20,8,C.red,{alpha:.85});
    });
    label(g,[-420,-315,0],'PRIVATE',C.cyan,12);label(g,[420,-315,0],'PUBLIC LKML',C.red,12);
    label(g,[0,300,0],'EMBARGO LOST',C.red,13);g.flush();
  };

  scenes.bars = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:-.18});
    const values=o.values||[104,1], names=o.labels||[], max=Math.max(...values);
    values.forEach((v,i)=>{
      const x=(i-.5)*440, height=(v/max)*420*enter(t,i*.15), tone=i?C.red:C.amber;
      g.box(x,260-height/2,0,90,Math.max(2,height/2),90,tone,{alpha:.9,edge:.75});
      for(let j=0;j<=4;j++)wire(g,[x-100,260-j*105,110],[x+100,260-j*105,110],C.steel);
      label(g,[x,220-height,-100],String(v),tone,30,{bold:true,priority:1});
      label(g,[x,300,100],names[i]||'',C.steel,11);
    });
    heading(g,'14 DAYS / DIFFERENT MEASURES',C.amber);g.flush();
  };

  scenes.core = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.18});
    g.prism(0,0,0,170,85,6,C.cyan,{alpha:.7,edge:.8,rot:Math.PI/6});
    g.prism(0,-12,0,110,86,6,C.amber,{alpha:.6,edge:.8,rot:Math.PI/6});
    const parts=o.parts||[];
    parts.forEach((name,i)=>{
      const a=i*TAU/6-Math.PI/2, p=[Math.cos(a)*430,Math.sin(a)*240,0],panic=name==='SLAB';
      node(g,p,name,panic?C.steel:C.cyan,t,i,{hx:32,hy:30,hz:30});
      flow(g,p,[0,0,0],t,panic?C.amber:C.red,i*.13,.22);
    });
    label(g,[0,-10,-120],'KERNEL',C.ink,17,{bold:true,priority:1});
    flow(g,[0,70,0],[0,265,200],t,C.amber,0,.22);
    label(g,[0,270,210],'HOST ROOT / 5 OF 6',C.amber,12);
    heading(g,'SIX KERNEL SUBSYSTEMS',C.cyan);
    if(o.fixed)label(g,[0,365,200],o.fixed,C.green,9);
    g.flush();
  };

  scenes.channels = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.10});
    const names=o.labels||['PUBLISHED','MODIFIED','FEEDS','OSS-SEC'];
    names.forEach((name,i)=>{
      const x=-420+i*280, tone=i===3?C.green:C.cyan;
      g.box(x,20,0,72,210,65,tone,{wire:true,alpha:0,edge:.55});
      label(g,[x,-260,0],name,tone,10);
      const y=-180+phase(t,.14,i*.15)*400;
      g.box(x,y,0,66,2,60,tone,{alpha:.6,edge:.65});
      for(let j=0;j<5;j++)g.box(x,-130+j*70,0,42,3,3,tone,{alpha:.3});
    });
    const k=phase(t,.13), caught=k>.65;
    const p=[caught?420:-280,-150+k*330,-95];
    g.octa(...p,17,caught?C.green:C.red,{alpha:.9});
    label(g,[p[0],p[1]-45,p[2]],caught?'CAUGHT':'MISSED',caught?C.green:C.red,11);
    label(g,[0,300,0],'DISCLOSURE CHANNELS MATTER',C.amber,12);g.flush();
  };

  scenes.stack = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.18});
    const cards=o.cards||[];
    cards.forEach((card,i)=>{
      const y=-220+i*84, x=(i%2?20:-20)+Math.sin(t*.65+i)*5, z=i*12;
      g.box(x,y,z,420,30,15,card.sev==='crit'?C.red:C.amber,{alpha:.66,edge:.4});
      label(g,[x-390,y,z-18],card.name,C.ink,11,{align:'left'});
      label(g,[x+390,y,z-18],card.cve?'→ '+card.fix:card.fix+' / NO CVE',card.cve?C.green:C.amber,10,{align:'right'});
    });
    heading(g,'58 ADVISORIES / 24 HOURS',C.cyan);g.flush();
  };

  scenes.decode = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.08});
    const core=[80,-40,0], out=[470,-40,0];
    [[-440,-200,0],[-440,45,0]].forEach((p,i)=>{
      node(g,p,i?'express / raw':'fetch RESPONSE',C.cyan,t,i,{hx:70,hy:35,hz:35,font:10});
      flow(g,p,core,t,C.amber,i*.4,.25);
    });
    node(g,core,'BROTLI DECODER',C.red,t,2,{hx:100,hy:80,hz:65});
    node(g,out,'PROCESS',C.red,t,3,{hx:45,hy:45,hz:45});
    flow(g,core,out,t,C.red,.2,.25);
    label(g,[470,85,0],'MARKER FILE',C.red,11);
    node(g,[-330,250,0],'bare http server',C.steel,t,4,{hx:85,hy:25,hz:35,font:10});
    wire(g,[-220,250,0],[-80,250,0],C.steel);tick(g,[-60,250,0],C.steel,true);
    label(g,[150,255,0],'NO INFLATE / NO DECODER',C.steel,10);
    heading(g,'CRAFTED BLOCK → NATIVE DECODER',C.amber);g.flush();
  };

  scenes.before = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.08});
    const y=150, patch=240;
    wire(g,[-490,y,0],[510,y,0],C.steel,2);
    gate(g,[patch,y,0],C.green,'PATCH');
    [['10.17',-460],['10.21 02:00',-90],['10.21 14:00',240],['10.22',470]].forEach(([name,x])=>{
      wire(g,[x,y-10,0],[x,y+16,0],C.steel);label(g,[x,240,0],name,x===patch?C.green:C.steel,10);
    });
    ring(g,[-460,y-10,0],26+4*Math.sin(t*1.2),C.amber,'xy');
    for(let i=0;i<5;i++)flow(g,[-160,y-20-i*12,0],[patch-18,y-20-i*12,0],t,C.red,i*.14,.3);
    label(g,[-250,-150,0],'482,342',C.amber,32,{bold:true,priority:1});
    label(g,[-250,-80,0],'REQUESTS / FIRST 24 H',C.steel,11);
    label(g,[-250,-20,0],'ATTEMPTS ≠ COMPROMISES',C.amber,10);
    heading(g,'FOUR DAYS BEFORE THE ADVISORY',C.amber);g.flush();
  };

  scenes.funnel = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.12});
    const cards=o.cards||[
      {id:'CVE-2026-111497',score:'9.2',kind:'CVSS 4.0'},
      {id:'CVE-2026-114625',score:'9.9',kind:'CNA'},
      {id:'CVE-2026-91637',score:'9.9',kind:'CNA'}];
    g.box(130,-10,0,10,235,85,C.cyan,{alpha:.35,edge:.8});
    cards.forEach((card,i)=>{
      const k=phase(t,.22,i*.23), x=-330+Math.sin(k*Math.PI)*250, y=-175+i*130;
      g.box(x,y,0,140,25,15,C.amber,{alpha:.8,edge:.65});
      label(g,[x,y, -20],card.kind+' / '+card.score,C.amber,11);
      wire(g,[x+145,y,0],[112,y,0],C.red);
    });
    label(g,[365,-120,0],'0 ROWS',C.red,24,{bold:true,priority:1});
    label(g,[365,-55,0],'CNA / CVSS 4.0',C.steel,10);
    flow(g,[-440,260,0],[430,260,0],t,C.green,0,.22);
    label(g,[0,310,0],'PRIMARY SCORE → PASS',C.green,10);
    heading(g,'cvssV3Severity=CRITICAL',C.cyan);g.flush();
  };

  scenes.ledger = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.12});
    const rows=o.rows||[
      {name:'ARISTA VELOCLOUD',figure:'9.9',tone:'red'}, {name:'LINUX KSMBD',figure:'9.0',tone:'amber'},
      {name:'CAPCOM ID',figure:'11,774,247',tone:'amber'}, {name:'ONAMAE DESKTOP CLOUD',figure:'26,739',tone:'amber'}];
    rows.forEach((row,i)=>{
      const y=-190+i*130, tone=C[row.tone]||C.amber;
      g.box(0,y,0,490,40,16,C.steel,{alpha:.5,edge:.25});
      label(g,[-455,y-8,-20],row.name,C.ink,11,{align:'left'});
      label(g,[280,y-8,-20],row.figure,tone,16,{align:'right',bold:true});
      flow(g,[310,y,0],[450,y,0],t,C.green,i*.2,.22);
      tick(g,[465,y,-20],C.green);
    });
    heading(g,'NEWS → PRIMARY SOURCE',C.cyan);
    label(g,[0,320,0],'FIGURES KEEP THEIR ORIGINAL MEANING',C.steel,10);g.flush();
  };

  scenes.checklist = (ctx,w,h,t,o) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.08});
    const conditions=o.conditions||['handler = php_binary','ini_set → php','before session_start','upload_progress on'];
    [-285,285].forEach((x,col)=>{
      const tone=col?C.green:C.red;
      label(g,[x,-280,0],col?'MITIGATED':'EXPOSED',tone,13);
      conditions.forEach((text,i)=>{
        const y=-165+i*100;
        g.box(x,y,0,215,28,18,tone,{alpha:.52+enter(t,i*.1)*.25,edge:.5});
        if(w>=500)label(g,[x-195,y,-22],text,C.ink,10,{align:'left'});
        else if(col===0)label(g,[0,y,-35],text,C.ink,10);
        tick(g,[x+190,y,-25],tone,col&&i===conditions.length-1);
      });
    });
    label(g,[0,260,0],'session.upload_progress.enabled = 0',C.green,12,{priority:1});
    heading(g,'FOUR CONDITIONS / ONE LINE',C.amber);g.flush();
  };

  scenes.intelConfluence = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.1});
    const names=['NVD','GHSA','KEV','JVN','FEEDS'];
    names.forEach((name,i)=>{
      const x=-450+i*225, p=[x,-170,(i%2)*80];
      node(g,p,name,i===2?C.red:C.cyan,t,i,{hx:50,hy:30,hz:40});
      curve(g,p,[0,95,0],t,i===2?C.red:C.cyan,i*.17,40);
    });
    for(let i=0;i<3;i++)g.prism(0,100+i*35,0,155+i*12,12,6,C.amber,{alpha:.8-i*.17,edge:.7,rot:Math.PI/6});
    label(g,[0,80,-125],'24',C.amber,38,{bold:true,priority:1});
    label(g,[0,260,0],'REVIEWED GROUPS',C.ink,12);
    heading(g,'COLLECT / CROSS-CHECK / PRIORITIZE',C.cyan);g.flush();
  };

  scenes.exploitIsolation = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.10});
    [['ARISTA VCO','VALID SESSION'],['COLLABORA','BUILT-IN CODE / NO AUTH']].forEach(([name,condition],i)=>{
      const y=-120+i*280;
      node(g,[-390,y,0],name,C.red,t,i,{hx:75,hy:40,hz:40});
      gate(g,[0,y,0],C.green,null);
      flow(g,[-310,y,0],[-25,y,0],t,C.red,i*.3,.35);
      node(g,[365,y,0],'PATCHED',C.green,t,i,{hx:80,hy:50,hz:45});
      wire(g,[20,y,0],[275,y,0],C.green);
      label(g,[-365,y+95,0],condition,C.steel,10);
      label(g,[365,y+100,0],'UPDATE + INVESTIGATE',C.green,10);
    });
    heading(g,'EXPLOITED / PATCH AND TRIAGE',C.red);g.flush();
  };

  scenes.packageBoundaries = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.15});
    ['PILLOW','WASMTIME','LARAVEL','ECHO'].forEach((name,i)=>{
      const x=-420+i*280, tone=[C.amber,C.cyan,C.green,C.amber][i];
      g.box(x,20,0,100,135,75,tone,{alpha:.58,edge:.6});
      g.box(x,20,-10,64,85,55,tone,{wire:true,edge:.8});
      label(g,[x,-175,0],name,tone,12);
      const k=phase(t,.16,i*.17);
      g.octa(x,-30+k*75,-95,16,C.red,{alpha:.9});
      label(g,[x,220,0],['IMAGE','WASM','TOKEN','PROXY'][i],C.steel,11);
      tick(g,[x,130,-78],C.green);
    });
    heading(g,'FOUR PACKAGES / FOUR BOUNDARIES');g.flush();
  };

  scenes.bundledLayers = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.26});
    const layers=[['APP INPUT','REGEXP','ONIGMO'],['MODULE','BUNDLED','BROTLI'],['REQUEST','DIRECTIVES','WORKER']];
    ['RUBY','PERL','NGINX'].forEach((name,i)=>{
      const x=(i-1)*340;
      label(g,[x,-255,0],name,C.ink,14);
      layers[i].forEach((text,j)=>{
        const y=-70+j*110, tone=j===1?C.amber:C.cyan;
        g.box(x,y,0,120,20,100,tone,{alpha:.8,edge:.7});
        label(g,[x,y,-110],text,tone,11);
      });
      const y=-125+phase(t,.13,i*.2)*340;
      g.box(x,y,0,128,1.5,108,C.green,{alpha:.5,edge:.9});
    });
    heading(g,'PATCH THE COPY THAT ACTUALLY RUNS',C.green);g.flush();
  };

  scenes.agentPermissions = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.14});
    node(g,[0,0,0],'AGENT',C.amber,t,0,{hx:60,hy:60,hz:60});
    const targets=[[-425,-170,'AUTH','IDENTITY'],[425,-170,'TLS','TRANSPORT'],[-425,170,'VAULT','SCOPE'],[425,170,'MODEL','INPUT']];
    targets.forEach(([x,y,name,tag],i)=>{
      const dest=[x,y,0], mid=[x*.53,y*.53,0];
      node(g,dest,tag,C.cyan,t,i,{hx:65,hy:35,hz:40,font:10});
      ring(g,mid,34,C.green,'xy');
      flow(g,[0,0,0],mid,t,C.amber,i*.19,.25);
      wire(g,mid,dest,C.green);
      label(g,[mid[0],mid[1]+(y<0?-60:65),0],name,C.green,11);
    });
    heading(g,'AUTHORITY MUST PASS EVERY GATE',C.amber);g.flush();
  };

  scenes.domesticRoutes = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.6,yaw:.10,pitchMin: 0.3});
    // A locator only: the cards are product groups, never incident cities.
    const islands=[
      [[50,-177],[74,-190],[110,-164],[101,-140],[73,-143],[57,-125],[38,-140]],
      [[58,-127],[74,-106],[60,-77],[42,-54],[33,-19],[8,4],[-17,15],[-30,43],[-65,57],[-85,83],[-125,92],[-158,114],[-195,114],[-211,99],[-184,79],[-143,73],[-108,57],[-89,28],[-47,12],[-26,-13],[4,-25],[17,-58],[43,-84]],
      [[-149,115],[-116,112],[-101,126],[-136,142],[-160,133]],
      [[-207,117],[-177,131],[-181,160],[-207,184],[-230,168],[-227,139]]
    ];
    const map=([x,z],y=100)=>[(x+65)*1.65,y,z*1.65];
    for(const island of islands) {
      g.quad(island.map(p=>map(p,119)),A(C.cyan,.25),{fill:A(C.cyan,.08)});
      g.quad(island.map(p=>map(p)),A(C.cyan,.7),{fill:A(C.cyan,.10)});
      for(let i=0;i<island.length;i++)wire(g,map(island[i]),map(island[i],119),C.cyan);
    }
    const groups=[[-430,-120,0,'LDAP'],[-400,150,140,'LIFF'],[390,110,100,'WEB / API']];
    groups.forEach(([x,y,z,name],i)=>{
      const p=[x,y,z];node(g,p,name,C.amber,t,i,{hx:60,hy:35,hz:40,font:10});
      flow(g,p,[60,70,0],t,C.cyan,i*.24,.2);
    });
    gate(g,[200,100,120],C.green,null);
    heading(g,'JAPAN / PRODUCT AND ACCESS REVIEW',C.cyan);
    label(g,[0,300,220],'SCHEMATIC LOCATOR / NOT INCIDENT LOCATIONS',C.steel,9);g.flush();
  };

  scenes.firmwareFleet = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.06});
    const lines=['10.8','10.7','10.4','8.13','8.10'];
    const fixes=['10.8.1.2','10.7.2.7','10.4.1.14','8.13.3.1','8.10.0.24'];
    lines.forEach((name,i)=>{
      const x=-560+i*280;
      node(g,[x,70,0],name,C.cyan,t,i,{hx:70,hy:135,hz:65,font:11});
      label(g,[x,260,0],fixes[i],C.green,10);
      for(let j=0;j<5;j++) {
        g.box(x,-25+j*47,-68,51,13,2,C.cyan,{alpha:.25,edge:.4});
        g.dot([x+40,-25+j*47,-73],1.8,C.green,{glow:false});
      }
      const y=-70+phase(t,.13,i*.15)*275;
      g.beam([x-70,y,-72],[x+70,y,-72],C.green,{width:1.5});
    });
    heading(g,'HPE AOS / 72 CVEs / 8 MAX-SCORE',C.amber);
    label(g,[0,320,0],'MATCH THE RELEASE LINE / NOT DEVICE COUNT',C.steel,10);g.flush();
  };

  scenes.trustRenewal = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.14});
    ['CERTIFICATE','SECURE BOOT','CREDENTIALS'].forEach((name,i)=>{
      const x=(i-1)*350;
      node(g,[x,-40,0],name,C.cyan,t,i,{hx:112,hy:100,hz:30,font:11});
      ring(g,[x,-40,-40],36,C.green,'xy');tick(g,[x,-40,-43]);
      flow(g,[x,70,0],[x,175,100],t,C.steel,i*.2,.18);
      g.box(x,210,100,52,18,24,C.steel,{wire:true,edge:.4});tick(g,[x,210,70],C.steel,true);
      label(g,[x,115,0],['REVOKE','VERIFY DBX','ROTATE'][i],C.green,12);
    });
    heading(g,'REPAIR THE CHAIN OF TRUST',C.amber);g.flush();
  };

  // Tailworm: explanatory lab threat models, never live attack telemetry.
  scenes.tailwormMesh = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.3,pitch:.55});
    const hub=[0,-40,0], peers=[[-350,-160,-170],[320,-150,-170],[-350,120,170],[320,120,170]];
    node(g,hub,'POLICY',C.cyan,t,0,{hx:70,hy:64,hz:60});
    peers.forEach((p,i)=>{
      const tone=i===0?C.amber:i===3?C.steel:C.cyan;
      node(g,p,['SOURCE','SSH HOST','SERVE','NO GRANT'][i],tone,t,i+1,{hx:75,hy:48,hz:50,font:10});
      wire(g,hub,p,C.steel);
      if(i<3)flow(g,hub,p,t,tone,i*.2,.16);
      else {const q=lerp(hub,p,.6);gate(g,q,C.steel,'DENIED');}
    });
    ring(g,hub,142,C.amber,'xy');
    heading(g,'TAILWORM / CHECK THE ALLOWED PATHS',C.amber);
    label(g,[0,270,0],'LAB FINDINGS / SCOPE UNDER REVIEW',C.steel,10);g.flush();
  };
  scenes.tailwormPrivilege = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.22,pitch:.5});
    const a=[-360,40,0],b=[-30,40,0],c=[330,-70,0];
    node(g,a,'APPROVED PEER',C.cyan,t,0,{hx:90,hy:55});
    gate(g,[-200,40,0],C.green,'SSH RULE');
    node(g,b,'SESSION USER',C.cyan,t,1,{hx:90,hy:55});
    node(g,c,'ROOT SOCKET',C.amber,t,2,{hx:92,hy:100,hz:50});
    flow(g,a,b,t,C.green,0,.2);flow(g,b,c,t,C.amber,.45,.2);
    g.box(160,60,0,8,150,110,C.amber,{wire:true,edge:.6});
    label(g,[160,-150,0],'PRIVILEGE BOUNDARY',C.amber,10);
    label(g,[0,245,160],'CHECK MODE GATES ENTRY / NOT SOCKET PRIVILEGE',C.steel,10);
    heading(g,'SSH FORWARDING / AUTHORIZED ENTRY REQUIRED',C.cyan);g.flush();
  };
  scenes.tailwormControl = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.3,pitch:.5});
    for(let i=0;i<5;i++){
      const x=-410+i*72;
      g.box(x,80,40,22,34,32,C.cyan,{alpha:.7,edge:.4});
      flow(g,[x,30,40],[-100,-10,0],t,C.amber,i*.16,.12);
    }
    gate(g,[-80,20,0],C.cyan,'RATE / EXPOSURE');
    node(g,[200,20,0],'HEADSCALE',C.amber,t,0,{hx:130,hy:145,hz:80});
    for(let i=0;i<6;i++){
      const k=phase(t,.08,i*.13);
      g.box(200,140-i*42,0,102,10+8*k,60,i<4?C.cyan:C.amber,{alpha:.5,edge:.35});
    }
    label(g,[200,235,90],'MEMORY / REGISTRATION',C.amber,10);
    heading(g,'SELF-HOSTED CONTROL PLANE / LIMIT + MONITOR',C.cyan);g.flush();
  };
  scenes.tailwormConnector = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.25,pitch:.58});
    const client=[-390,80,0],relay=[-90,30,0];
    node(g,client,'ENTITLED CLIENT',C.cyan,t,0,{hx:85,hy:55});
    node(g,relay,'CONN25',C.amber,t,1,{hx:70,hy:75,hz:65});
    flow(g,client,relay,t,C.cyan,0,.17);
    [[310,-170,-150],[330,20,0],[310,200,150]].forEach((p,i)=>{
      node(g,p,['APP','METADATA','CLUSTER'][i],i===0?C.green:C.amber,t,i+2,{hx:75,hy:40,hz:42,font:10});
      const barrier=lerp(relay,p,.55);gate(g,barrier,i===0?C.green:C.amber,i===0?'ALLOW':'RESTRICT');
      flow(g,relay,lerp(relay,p,i===0?1:.5),t,i===0?C.green:C.amber,i*.23,.15);
    });
    heading(g,'EXPERIMENTAL CONNECTOR / VALIDATE REAL DESTINATIONS',C.amber);g.flush();
  };
  scenes.tailwormServe = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.28,pitch:.52});
    const front=[-300,20,0];node(g,front,'SERVE CONFIG',C.cyan,t,0,{hx:120,hy:80,hz:55});
    const paths=[[200,-170,-160],[250,10,0],[200,185,150]];
    paths.forEach((p,i)=>{
      node(g,p,['APP AUTH','LOCAL API','EXTERNAL BIND'][i],i===0?C.green:C.amber,t,i+1,{hx:100,hy:40,hz:42,font:10});
      curve(g,front,p,t,i===0?C.green:C.amber,i*.25,35);
    });
    ring(g,[250,10,0],120,C.amber,'xy');
    heading(g,'CONFIGURATION + MOUNTS + BACKEND AUTHORIZATION',C.cyan);
    label(g,[-240,240,100],'AUDIT UNIX SOCKET FORWARDS',C.amber,11);g.flush();
  };
  scenes.tailwormResponse = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.18,pitch:.55});
    const names=['INVENTORY','RESTRICT','REVOKE','TRACK FIX'];
    names.forEach((name,i)=>{
      const x=-390+i*260, y=80-i*35, tone=i===2?C.amber:C.cyan;
      node(g,[x,y,0],name,tone,t,i,{hx:96,hy:60,hz:55,font:10});
      g.box(x,y+90,0,110,5,68,C.steel,{alpha:.4,edge:.3});
      tick(g,[x,y,-60],i===3?C.steel:C.green,i===2);
      if(i<3)flow(g,[x+100,y,0],[x+160,y-35,0],t,C.cyan,i*.2,.18);
    });
    heading(g,'REBUILD + IDENTITY REVOCATION',C.amber);
    label(g,[0,275,80],'1.104.2 CERTIFICATE FIX ≠ TAILWORM FIX',C.steel,10);g.flush();
  };
  scenes.nightDelta = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.25,pitch:.58});
    for(let i=0;i<2;i++){
      const x=i===0?-270:270;
      g.prism(x,110,0,155,45,6,i?C.amber:C.cyan,{alpha:.7,edge:.6,rot:Math.PI/6});
      label(g,[x,-100,0],i?'MODIFIED 87':'PUBLISHED 87',i?C.amber:C.cyan,12);
      for(let j=0;j<8;j++){
        const a=j*TAU/8+t*.1,p=[x+Math.cos(a)*130,20,Math.sin(a)*100];
        g.octa(...p,5,C.cyan,{alpha:.7});
      }
    }
    flow(g,[-160,40,0],[160,40,0],t,C.green,0,.2);
    label(g,[0,220,140],'SAME IDENTIFIERS / DO NOT SUM',C.green,12);
    heading(g,'FIXED WINDOW / 07:34 → 14:18 UTC',C.cyan);g.flush();
  };
  scenes.nightRestoration = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.24,pitch:.55});
    const a=[-330,20,0],b=[20,20,0],c=[350,20,0];
    node(g,a,'ARCHIVES',C.cyan,t,0,{hx:100,hy:110,hz:70});
    node(g,b,'RESTORE FIRST',C.green,t,1,{hx:90,hy:55,hz:55});
    node(g,c,'RE-ENROLL',C.steel,t,2,{hx:85,hy:55,hz:55});
    flow(g,a,b,t,C.green,0,.12);wire(g,b,c,C.steel);gate(g,[190,20,0],C.amber,'AWAIT GUIDANCE');
    for(let i=0;i<4;i++)g.box(-330,-55+i*48,-75,75,4,1,C.cyan,{alpha:.6});
    heading(g,'CONNECTWISE / OCT 25 14:00 UTC',C.amber);
    label(g,[0,260,80],'RESTORATION TARGET ≠ RECONNECT PERMISSION',C.steel,10);g.flush();
  };

  // October 26: explanatory models, not a live activity feed.
  scenes.morningEvidence = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.15,pitch:.52});
    const a=[-330,45,70],b=[0,-80,-20],c=[330,45,70];
    node(g,a,'OBSERVATIONS',C.cyan,t,0,{hx:105,hy:80,hz:65});
    node(g,b,'VERIFY SOURCE',C.amber,t,1,{hx:100,hy:115,hz:70});
    node(g,c,'ATTRIBUTION',C.steel,t,2,{hx:95,hy:55,hz:65});
    flow(g,a,b,t,C.cyan,0,.14);wire(g,b,c,C.steel);
    gate(g,[180,0,30],C.amber,'NOT CONFIRMED');
    heading(g,'28 PUBLISHED / 4276 MODIFIED / OVERLAP',C.cyan);
    label(g,[0,270,60],'ATTEMPT ≠ COMPROMISE ≠ INITIAL ACCESS',C.amber,11);g.flush();
  };
  scenes.socketRepair = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.24,pitch:.55});
    const a=[-320,15,0],b=[0,15,0],c=[330,15,0];
    node(g,a,'IPv4',C.cyan,t,0,{hx:80,hy:70,hz:60});
    node(g,b,'CACHED BUFFER',C.red,t,1,{hx:105,hy:35,hz:45});
    node(g,c,'IPv6',C.amber,t,2,{hx:95,hy:115,hz:70});
    flow(g,a,b,t,C.cyan,0,.2);flow(g,c,b,t,C.red,.5,.2);
    for(let i=0;i<4;i++)g.box(-70+i*45,115,0,16,5,36,i<2?C.green:C.red,{alpha:.75});
    ring(g,b,150,C.amber,'xy');
    heading(g,'WINDOWS .NET / CVE-2026-70197',C.amber);
    label(g,[0,275,70],'OOB FIX → REBUILD → VERIFY RUNTIME',C.green,11);g.flush();
  };
  scenes.embeddedPhp = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.25,pitch:.52});
    g.box(80,20,0,300,180,150,C.steel,{alpha:.22,edge:.7});
    g.box(80,20,0,210,125,110,C.cyan,{alpha:.25,edge:.65});
    node(g,[80,20,0],'PHP',C.amber,t,0,{hx:80,hy:65,hz:60});
    node(g,[-370,150,60],'VENDOR FIX',C.green,t,1,{hx:80,hy:50,hz:40});
    flow(g,[-285,140,60],[-140,60,0],t,C.green,0,.12);
    label(g,[80,-240,0],'RUGGEDCOM APE1808',C.steel,12);
    label(g,[80,215,110],'PAN-OS / CHECK THE RELEASE LINE',C.cyan,11);
    heading(g,'DEPENDENCIES INSIDE APPLIANCES',C.amber);g.flush();
  };
  scenes.datedArchive = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{yaw:.18,pitch:.56});
    const pts=[];
    for(let i=0;i<10;i++) {
      const row=i<5?0:1,col=i<5?i:9-i;
      const p=[-360+col*180,-110+row*265,(i%2)*25];pts.push(p);
      const tone=i===9?C.amber:C.cyan;
      g.box(p[0],p[1],p[2],65,60*enter(t,i*.05),18,tone,{alpha:.5,edge:.7});
      label(g,[p[0],p[1]-90,p[2]],String(17+i),tone,16);
      if(i)flow(g,pts[i-1],p,t,tone,i*.1,.09);
    }
    heading(g,'OCTOBER 17—26 / DAILY RECORD',C.amber);
    label(g,[0,295,70],'OBSERVED / PUBLISHED / FIXED / REVISED',C.steel,11);g.flush();
  };

  // Deployment paths are a schematic: an SDK/runtime update does not replace
  // the already-linked decoder inside a bundled or NativeAOT application.
  scenes.deploymentPaths = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch:.52,yaw:.18});
    ['SHARED','BUNDLE','AOT'].forEach((name,i)=>{
      const x=(i-1)*380, tone=i===0?C.green:C.amber;
      label(g,[x,-255,0],name,C.ink,13);
      node(g,[x,-125,0],['RUNTIME','BUILD','SDK/PACK'][i],C.cyan,t,i,{hx:70,hy:34,hz:48,font:10});
      node(g,[x,185,0],'RUNNING',tone,t,i+3,{hx:70,hy:34,hz:48,font:10});
      flow(g,[x,-75,0],[x,130,0],t,tone,i*.2,.17);
      g.prism(x,35,0,44,6,6,tone,{alpha:.55,edge:.6});
      label(g,[x,20,-105],['RESTART','REDEPLOY','REPUBLISH'][i],tone,10);
    });
    heading(g,'UPDATE THE BINARY THAT ACTUALLY RUNS',C.green);g.flush();
  };

  scenes.releaseStates = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch:.5,yaw:.12});
    const rows=[['PAN-OS','RELEASED',C.green],['NEAT','STAGED',C.amber],['CONNECTWISE','TARGET',C.cyan]];
    rows.forEach(([name,status,tone],i)=>{
      const y=-210+i*210;
      node(g,[-380,y,0],name,C.steel,t,i,{hx:82,hy:30,hz:38,font:10});
      node(g,[380,y,0],status,tone,t,i+3,{hx:74,hy:30,hz:38,font:10});
      wire(g,[-275,y,0],[275,y,0],C.steel);
      const end=i===0?265:i===1?90:-85;
      flow(g,[-270,y,0],[end,y,0],t,tone,i*.23,.16);
      g.octa(end,y,0,16,tone,{alpha:.8});
      if(i>0)g.box(220,y,0,4,42,45,C.amber,{wire:true,edge:.6});
    });
    heading(g,'RELEASE / DEPLOYMENT / RESTORATION');g.flush();
  };

  scenes.storm = (ctx,w,h,t) => {
    const g=stage(ctx,w,h,t,{pitch: 0.52,yaw:.16});
    const pts=[];
    for(let i=0;i<80;i++) {
      const a=i*2.399+t*.025, r=210+(i*43)%330;
      const p=[Math.cos(a)*r,((i*71)%470)-235,Math.sin(a)*r*.75];pts.push(p);
      g.octa(...p,i%9===0?12:5,i%9===0?C.amber:C.cyan,{alpha:i%9===0?.9:.5});
    }
    for(let i=0;i<80;i+=3)wire(g,pts[i],pts[(i+11)%80],C.cyan);
    g.prism(0,0,0,100,55,6,C.amber,{alpha:.8,edge:.85,rot:Math.PI/6});
    ring(g,[0,0,0],165,C.amber,'xy');
    label(g,[0,295,0],'THE CODE WE TRUST',C.amber,17,{priority:1});
    heading(g,'VERIFY / PATCH / REVOKE / ROTATE',C.cyan);g.flush();
  };

  function frame(ctx,w,h,t) {
    ctx.save();ctx.strokeStyle=A(C.steel,.28);ctx.lineWidth=.75;
    const m=8,L=14;
    for(const [x,y,sx,sy] of [[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]]) {
      ctx.beginPath();ctx.moveTo(x,y+sy*L);ctx.lineTo(x,y);ctx.lineTo(x+sx*L,y);ctx.stroke();
    }
    // Quiet edge metering; no pulsing full-screen overlays.
    for(let i=0;i<12;i++) {
      const x=w/2-44+i*8;
      ctx.fillStyle=A(i<=phase(t,.06)*12?C.cyan:C.steel,.28);
      ctx.fillRect(x,h-7,3,2);
    }
    ctx.restore();
  }
  return {
    setOrbit(angle) { R.setOrbit(angle); },
    setTilt(yaw,pitch) { R.setTilt(yaw,pitch); },
    getTilt() { return R.getTilt(); },
    draw(visual,ctx,w,h,t,reduced,ox,oy,viewport) {
      const type=visual&&visual.type||'radar', fn=scenes[type]||scenes.radar;
      const v=viewport||{x:ox||0,y:oy||0,width:w,height:h};
      const time=reduced?4:Math.max(0,t);
      R.setView(v.width,v.height,v.anchorX == null ? .5 : v.anchorX,v.anchorY == null ? .5 : v.anchorY);
      ctx.clearRect(0,0,w,h);
      if(window.__labelSink)window.__labelSink.length=0;
      window.__viewOffset={x:v.x,y:v.y};
      ctx.save();ctx.translate(v.x,v.y);
      ctx.beginPath();ctx.rect(0,0,v.width,v.height);ctx.clip();
      const glow=ctx.createRadialGradient(v.width*.5,v.height*.5,0,v.width*.5,v.height*.5,Math.max(v.width,v.height)*.6);
      glow.addColorStop(0,'rgba(19,44,61,.42)');glow.addColorStop(1,'rgba(5,8,13,0)');
      ctx.fillStyle=glow;ctx.fillRect(0,0,v.width,v.height);
      fn(ctx,v.width,v.height,time,visual||{});
      frame(ctx,v.width,v.height,time);
      ctx.restore();
    }
  };
})();
