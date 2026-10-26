import {cp, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

// Publish a static copy; local development URLs and original assets stay intact.
const base=process.argv[2]??'/zijin-language-rpg/';
if(!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))throw Error('Expected a path such as /zijin-language-rpg/');
const root=path.resolve('dist');
await mkdir(root,{recursive:true});
for(const name of ['index.html','src','public'])await cp(name,path.join(root,name),{recursive:true});
let rewritten=0;
async function walk(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())await walk(file);
    else if(/\.(?:html|js|css|json)$/.test(entry.name)){
      let source=await readFile(file,'utf8');
      source=source.replace(/(["'`(])\/(public|src)\//g,(_,lead,folder)=>lead+base+folder+'/');
      source=source.replace(/href=(["'])\/\1/g,(_,quote)=>'href='+quote+base+quote);
      await writeFile(file,source);rewritten++;
    }
  }
}
await walk(root);
await writeFile(path.join(root,'.nojekyll'),'');
console.log(`GitHub Pages static build: ${base}, ${rewritten} text files, output dist/`);
