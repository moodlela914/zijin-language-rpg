import {cp, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Publish a static copy; local development URLs and original assets stay intact.
const base=process.argv[2]??'/zijin-language-rpg/';
if(!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base))throw Error('Expected a path such as /zijin-language-rpg/');
const root=path.resolve('dist');
await mkdir(root,{recursive:true});
for(const name of ['index.html','src','public'])await cp(name,path.join(root,name),{recursive:true});
let rewritten=0;
const hash=createHash('sha256');
async function hashSource(dir){
  for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())await hashSource(file);
    else if(/\.(js|css)$/.test(entry.name))hash.update(file).update(await readFile(file));
  }
}
await hashSource('src');
const revision=hash.digest('hex').slice(0,12);
async function walk(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()&&entry.name!=='.git')await walk(file);
    else if(/\.(?:html|js|css|json)$/.test(entry.name)){
      let source=await readFile(file,'utf8');
      source=source.replace(/(["'`(])\/(public|src)\//g,(_,lead,folder)=>lead+base+folder+'/');
      source=source.replace(/href=(["'])\/\1/g,(_,quote)=>'href='+quote+base+quote);
      source=source.replace(/(["'])([^"'\n]+\.(?:js|css))(?:\?v=[^"']*)?\1/g,(_,quote,url)=>quote+url+'?v='+revision+quote);
      await writeFile(file,source);rewritten++;
    }
  }
}
await walk(root);
await writeFile(path.join(root,'.nojekyll'),'');
console.log(`GitHub Pages static build: ${base}, ${rewritten} text files, output dist/`);
