import { spawn } from "node:child_process";
import { chromium } from "playwright";

const baseURL="http://127.0.0.1:4173";
const server=spawn("pnpm",["start","--hostname","127.0.0.1","--port","4173"],{stdio:"ignore",env:{...process.env,NODE_ENV:"production"}});
const routes=[
 "/","/explore","/catalogue","/how-it-works","/about","/impact","/faq","/blog","/community","/sitemap-page","/methodology","/privacy","/terms","/cookies","/login",
 "/dashboard","/dashboard/explore","/dashboard/catalogue","/dashboard/activity","/dashboard/account","/dashboard/settings"
];
const viewports=[
 {name:"iPhone SE",width:320,height:568,isMobile:true,hasTouch:true,deviceScaleFactor:2},
 {name:"iPhone 15 Pro",width:393,height:852,isMobile:true,hasTouch:true,deviceScaleFactor:3},
 {name:"iPad",width:768,height:1024,isMobile:false,hasTouch:true,deviceScaleFactor:2},
 {name:"Desktop",width:1440,height:900,isMobile:false,hasTouch:false,deviceScaleFactor:1}
];
const problems=[];
async function waitForServer(){
 for(let i=0;i<80;i++){
  try{const res=await fetch(baseURL);if(res.ok)return}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 throw new Error("Next.js production server did not start on port 4173.");
}
try{
 await waitForServer();
 const browser=await chromium.launch({headless:true});
 try{
  const guest=await browser.newContext({viewport:{width:393,height:852}});
  const guestPage=await guest.newPage();
  await guestPage.goto(baseURL+"/dashboard/explore",{waitUntil:"domcontentloaded"});
  if(!new URL(guestPage.url()).pathname.startsWith("/login"))problems.push("Unauthenticated dashboard did not redirect to /login.");
  await guest.close();

  const loginContext=await browser.newContext({viewport:{width:393,height:852}});
  const loginPage=await loginContext.newPage();
  await loginPage.goto(baseURL+"/login",{waitUntil:"domcontentloaded"});
  await loginPage.getByRole("button",{name:/Continue with demo account/}).click();
  await loginPage.waitForURL(/\/dashboard/,{timeout:10000}).catch(()=>problems.push("Demo login did not enter the dashboard."));
  await loginContext.close();

  for(const viewport of viewports){
   const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},isMobile:viewport.isMobile,hasTouch:viewport.hasTouch,deviceScaleFactor:viewport.deviceScaleFactor});
   await context.addCookies([{name:"greenswap-session",value:"demo",url:baseURL}]);
   const page=await context.newPage();
   page.setDefaultTimeout(10000);
   for(const route of routes){
    const runtimeErrors=[];
    const onError=error=>runtimeErrors.push(error.message);
    page.on("pageerror",onError);
    try{
     const response=await page.goto(baseURL+route,{waitUntil:"domcontentloaded"});
     if(!response||response.status()>=400)problems.push(`[${viewport.name}] ${route}: HTTP ${response?.status()??"no response"}`);
     await page.locator("h1").first().waitFor();
     await page.waitForTimeout(60);
     const layout=await page.evaluate(()=>({
      viewport:window.innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,
      images:[...document.images].map(image=>({src:image.getAttribute("src"),complete:image.complete,naturalWidth:image.naturalWidth})),
      heading:document.querySelector("h1")?.textContent?.trim()??""
     }));
     if(layout.document>viewport.width+1||layout.body>viewport.width+1)problems.push(`[${viewport.name}] ${route}: horizontal overflow viewport=${viewport.width}, document=${layout.document}, body=${layout.body}`);
     const broken=layout.images.filter(image=>image.complete&&image.naturalWidth===0);
     if(broken.length)problems.push(`[${viewport.name}] ${route}: broken images ${JSON.stringify(broken)}`);
     if(route==="/"&&!layout.heading.includes("Make a lighter footprint."))problems.push(`[${viewport.name}] home headline missing: ${layout.heading}`);
     if(route==="/faq"){
      const count=await page.locator("main details").count();
      if(count!==10)problems.push(`[${viewport.name}] FAQ should expose 10 answers but has ${count}`);
     }
     if(runtimeErrors.length)problems.push(`[${viewport.name}] ${route}: runtime errors: ${runtimeErrors.join(" | ")}`);
    }catch(error){problems.push(`[${viewport.name}] ${route}: ${error instanceof Error?error.message:String(error)}`)}
    finally{page.off("pageerror",onError)}
   }
   await context.close();
  }
 }finally{await browser.close()}
}finally{server.kill("SIGTERM")}
if(problems.length){console.error(`Browser QA failed with ${problems.length} issue(s):`);for(const problem of problems)console.error("- "+problem);process.exit(1)}
console.log(`Browser QA passed: ${routes.length} direct routes across ${viewports.length} viewport profiles (${routes.length*viewports.length} route viewport checks).`);
