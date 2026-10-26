// Export the same authored data and chronology without starting the app/browser.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),scope={window:{}};vm.createContext(scope);
for(const file of ['data.js','chronology.js'])vm.runInContext(fs.readFileSync(path.join(root,'site',file),'utf8'),scope);
process.stdout.write(JSON.stringify({languages:scope.window.LANGUAGES,scenes:scope.window.BRIEFING_NAV.scenes.map((scene,i)=>({...scene,number:scope.window.BRIEFING_NAV.numberFor(i)}))}));
