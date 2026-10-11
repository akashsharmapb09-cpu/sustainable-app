import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root=process.cwd();
const appRoot=path.join(root,"app");
const sourceRoots=["app","components","lib"].map(part=>path.join(root,part));
const extensions=/\.(?:tsx|ts|jsx|js|mdx)$/;
async function walk(directory){const result=[];let entries=[];try{entries=await readdir(directory,{withFileTypes:true})}catch{return result}for(const entry of entries){const full=path.join(directory,entry.name);if(entry.isDirectory())result.push(...await walk(full));else if(extensions.test(entry.name))result.push(full)}return result}
const files=(await Promise.all(sourceRoots.map(walk))).flat();
const routePages=files.filter(file=>path.relative(appRoot,file).split(path.sep).at(-1)==="page.tsx");
const routes=routePages.map(file=>{const rel=path.relative(appRoot,path.dirname(file)).split(path.sep).filter(Boolean).filter(part=>!(part.startsWith("(")&&part.endsWith(")")));return "/"+rel.map(part=>part.startsWith("[")&&part.endsWith("]")?":dynamic":part).join("/")});
function routeExists(pathname){const clean=pathname==="/"?"/":pathname.replace(/\/$/,"");return routes.some(route=>{if(route===clean)return true;const regex="^"+route.split("/").map(segment=>segment===":dynamic"?"[^/]+":segment.replace(/[.*+?^\${}()|[\]\\]/g,"\\$&")).join("/")+"$";return new RegExp(regex).test(clean)})}
const problems=[];
let literalLinks=0;
for(const file of files){const source=await readFile(file,"utf8");const rel=path.relative(root,file);const ids=new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map(match=>match[1]));
 for(const match of source.matchAll(/(?:href|src)\s*=\s*["'](\/[^"'\s]*)["']/g)){const dest=match[1];if(dest.startsWith("//"))continue;const pathname=(dest.split(/[?#]/)[0]||"/").replace(/\/$/,"")||"/";literalLinks++;
  if(/\.[a-z0-9]{2,8}$/i.test(pathname)){const asset=pathname.replace(/^\//,"");if(!existsSync(path.join(root,"public",asset))&&!existsSync(path.join(root,asset)))problems.push(`Missing static asset ${pathname} in ${rel}`);continue}
  if(!routeExists(pathname))problems.push(`Unregistered internal route ${pathname} in ${rel}`);
 }
 if(path.basename(file)!=="layout.tsx"){for(const match of source.matchAll(/href=["']#([^"']+)["']/g)){if(!ids.has(match[1]))problems.push(`Missing local anchor #${match[1]} in ${rel}`)}}
}
for(const asset of ["og-image.png","favicon.svg"])if(!existsSync(path.join(root,"public",asset)))problems.push(`Missing public/${asset}`);
if(problems.length){console.error(`Route/asset audit failed with ${problems.length} issue(s):`);for(const problem of problems)console.error("- "+problem);process.exit(1)}
console.log(`Route/asset audit passed: ${routes.length} page routes, ${literalLinks} literal internal links/assets, ${files.length} files inspected.`);
