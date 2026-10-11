import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
const config:Config={
 darkMode:["class"],
 content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./lib/**/*.{js,ts,jsx,tsx,mdx}"],
 theme:{extend:{
  fontFamily:{sans:["var(--font-sans)","Arial","sans-serif"],mono:["var(--font-mono)","ui-monospace","monospace"]},
  colors:{canvas:"#f7f8f5",ink:"#141914",muted:"#727970",line:"#e6e9e3",forest:{50:"#eef8f0",100:"#d7efdc",500:"#2e8b4e",600:"#237341",700:"#1c5a35",900:"#123b25"}},
  boxShadow:{panel:"0 1px 2px rgb(16 24 16 / 4%), 0 12px 36px rgb(16 24 16 / 4%)",green:"0 12px 32px rgb(35 115 65 / 18%)"},
  borderRadius:{"4xl":"2rem"},
  animation:{"pulse-dot":"pulse-dot 1.8s ease-in-out infinite","rise-in":"rise-in .5s cubic-bezier(.2,.8,.2,1) both"},
  keyframes:{"pulse-dot":{"0%,100%":{transform:"scale(1)",opacity:"1"},"50%":{transform:"scale(.78)",opacity:".55"}},"rise-in":{from:{opacity:"0",transform:"translateY(8px)"},to:{opacity:"1",transform:"translateY(0)"}}}
 }},
 plugins:[typography]
};
export default config;
