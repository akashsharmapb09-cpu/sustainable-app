import { NextResponse, type NextRequest } from "next/server";
export function middleware(request:NextRequest){const hasDemoSession=request.cookies.get("greenswap-session")?.value==="demo";if(hasDemoSession)return NextResponse.next();const login=new URL("/login",request.url);login.searchParams.set("next",request.nextUrl.pathname+request.nextUrl.search);return NextResponse.redirect(login)}
export const config={matcher:["/dashboard/:path*"]};
