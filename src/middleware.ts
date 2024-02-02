import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  

  if (!req.url.includes("/api")) {
    if (
      !req.cookies.has("puppiesGramSession") &&
      !req.url.includes("/log-in") &&
      !req.url.includes("/create-account") &&
      !req.url.includes("/")
    ) {
      url.pathname = "/create-account";
      return NextResponse.redirect(url);
    }
  }
}
