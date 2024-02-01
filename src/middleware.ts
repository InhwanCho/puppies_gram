import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!req.url.includes("/api")) {
    if (
      !req.cookies.has("mungstaSession") &&
      !req.url.includes("/log-in") &&
      !req.url.includes("/create-account")
    ) {
      url.pathname = "/log-in";
      return NextResponse.redirect(url);
    }
  }
}
