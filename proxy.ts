import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'marmalade_admin';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (token !== process.env.ADMIN_PASSWORD) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
