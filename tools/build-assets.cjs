// Production-only packaging. Sources remain editable and independent for tests.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),site=path.join(root,'site'),directory=path.join(site,'assets');
const check=process.argv.includes('--check');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const sources={};
function read(file){const value=fs.readFileSync(path.join(site,file),'utf8');sources[file]=hash(value);return value;}
const outputs={};
function asset(name,code,extension='js') {
 const file=`assets/${name}-${hash(code).slice(0,12)}.${extension}`;outputs[file]=code;return file;
}
function javascript(name,files,define={},target='es2015') {
 const source=files.map(read).join('\n;\n');
 const result=esbuild.transformSync(source,{target,minify:true,charset:'utf8',legalComments:'none',define});
 return asset(name,result.code);
}
const locales={};
for(const file of fs.readdirSync(path.join(site,'i18n')).filter(file=>file.endsWith('.js')).sort()) {
 const code=file.slice(0,-3);locales[code]='./'+javascript('locale-'+code,['i18n/'+file]);
}
const motion=javascript('motion',['data.js','chronology.js','render.js','rig3d.js','visuals.js','app.js'],{
 BRIEFING_LOCALE_FILES:JSON.stringify(locales)
});
const platform=javascript('platform',['platform.js'],{},'es5');
const boot=javascript('boot',['browser-ui.js','viewport.js','privacy.js','audio.js','entry.js'],{
 BRIEFING_MOTION_FILE:JSON.stringify(motion)
});
const cssSource=['style.css','privacy.css','mobile.css','brave.css','publishing.css'].map(read).join('\n');
const css=asset('shell',esbuild.transformSync(cssSource,{loader:'css',minify:true,target:['safari12','chrome64','firefox68','edge79'],legalComments:'none'}).code,'css');
const current={platform,boot,motion,css,...Object.fromEntries(Object.entries(locales).map(([code,file])=>['locale-'+code,file.slice(2)]))};
const manifestFile=path.join(directory,'manifest.json');
const previous=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
const manifest={current,previous:JSON.stringify(current)===JSON.stringify(previous.current)?(previous.previous||{}):(previous.current||{}),sources};
let html=fs.readFileSync(path.join(site,'index.html'),'utf8');
html=html.replace(/<!-- runtime-assets:start -->[\s\S]*?<!-- runtime-assets:end -->\s*/g,'')
 .replace(/<script src="(?:\.\/|\/)?(?:platform|browser-ui|viewport|privacy|audio|entry)\.js[^"\s]*" defer><\/script>\s*/g,'')
 .replace(/<link rel="stylesheet" href="(?:\.\/|\/)?(?:style|privacy|mobile|brave|publishing)\.css[^"\s]*">\s*/g,'');
const tags=`<!-- runtime-assets:start -->\n<link rel="stylesheet" href="/${css}">\n<script src="/${platform}" defer></script>\n<script src="/${boot}" defer></script>\n<!-- runtime-assets:end -->\n`;
html=html.replace('</head>',tags+'</head>');
const writes={...outputs,'index.html':html};
let stale=false;
for(const [file,value] of Object.entries(writes)) {
 const destination=path.join(site,file);
 const same=fs.existsSync(destination)&&fs.readFileSync(destination,'utf8')===value;
 if(check){if(!same){console.error('Stale asset: '+file);stale=true;}}
 else if(!same){fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,value);}
}
const manifestText=JSON.stringify(manifest,null,2)+'\n';
if(check) {
 if(!fs.existsSync(manifestFile)||fs.readFileSync(manifestFile,'utf8')!==manifestText){console.error('Stale asset manifest');stale=true;}
 if(stale)process.exitCode=1;
} else {
 fs.writeFileSync(manifestFile,manifestText);
 // One previous generation remains available for already open documents.
 const retain=new Set([...Object.values(current),...Object.values(manifest.previous)]);
 for(const file of fs.readdirSync(directory))if(/^(?:platform|boot|motion|shell|locale-[a-z-]+)-[a-f0-9]{12}\.(?:js|css)$/.test(file)&&!retain.has('assets/'+file))fs.unlinkSync(path.join(directory,file));
}
console.log(JSON.stringify({check,assets:Object.keys(outputs).length,
 initialRequests:3,initialBytes:[platform,boot,css].reduce((n,file)=>n+Buffer.byteLength(outputs[file]),0),
 motionBytes:Buffer.byteLength(outputs[motion]),motionGzip:zlib.gzipSync(outputs[motion]).length}));
