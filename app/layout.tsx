import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";
const inter=Inter({subsets:["latin"],display:"swap",variable:"--font-sans"});
const dmMono=DM_Mono({subsets:["latin"],weight:["400","500"],display:"swap",variable:"--font-mono"});
export const metadata:Metadata={
 metadataBase:new URL("https://sustainable-app-qccf.vercel.app"),
 title:{default:"GreenSwap — Make a lighter footprint. Keep the good life.",template:"%s · GreenSwap"},
 description:"Practical sustainable swaps backed by published environmental data. Find everyday changes that fit your budget, routine and real life.",
 applicationName:"GreenSwap",
 keywords:["sustainable living","eco-friendly swaps","carbon footprint","waste reduction","climate action"],
 openGraph:{type:"website",siteName:"GreenSwap",title:"Make a lighter footprint. Keep the good life.",description:"Practical swaps backed by DEFRA, CEA and EPA data.",images:[{url:"/og-image.png",width:1200,height:630,alt:"GreenSwap — 0.7t saved, an illustrative example"}]},
 twitter:{card:"summary_large_image",title:"GreenSwap — practical swaps for real life",description:"Make a lighter footprint. Keep the good life.",images:["/og-image.png"]},
 icons:{icon:"/favicon.svg"},
 robots:{index:true,follow:true}
};
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#123b25"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${inter.variable} ${dmMono.variable}`}><body className="font-sans antialiased"><Link className="skip-link" href="#main-content">Skip to content</Link>{children}</body></html>}