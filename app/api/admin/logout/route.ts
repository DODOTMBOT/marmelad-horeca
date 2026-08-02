import { NextResponse } from 'next/server';

export function GET() {
  const res = NextResponse.redirect(new URL('/admin/login', 'http://localhost'));
  res.cookies.delete('marmalade_admin');
  return res;
}
