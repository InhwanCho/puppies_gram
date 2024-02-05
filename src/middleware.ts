import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {  
  
  // if (!req.nextUrl.pathname.startsWith("/api")) {
  //   if (
  //     // !req.cookies.has("puppiesGramSession") &&
  //     !req.nextUrl.pathname.startsWith("/log-in") &&
  //     !req.nextUrl.pathname.startsWith("/create-account")
  //     // && !req.nextUrl.pathname.startsWith("/")
  //   ) {
  //     return NextResponse.redirect(new URL('/log-in',req.url));      
  //   }
  // }
}

// export const config = {
//   matcher: ['/((?!api|_next/static|favicon.ico).*)'],
// };
