import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get('token');
  console.log(token, 'token')

  if (!token) {
    return NextResponse.redirect(
      new URL('/', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat', '/searchcases','/casedetail'],
};
