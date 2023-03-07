/* eslint-disable @typescript-eslint/no-use-before-define */
import { NextRequest, NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

// custom jwt validation
// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/checkout')) {
//     try {
//       const token = request.cookies.get('token')?.value ?? '';
//       await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_SEED));
//       return NextResponse.next();
//     } catch (error) {
//       const url = request.nextUrl.clone();
//       url.basePath = `/auth/login?p=`;
//       return NextResponse.redirect(url);
//     }
//   }
// }

// next auth validation
export async function middleware(req: NextRequest) {
  // en los middleware es recomendado usar getToken embar de getSession
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // BACK
  const entriesBaseUrl = '/api/admin';
  if (req.nextUrl.pathname.startsWith(entriesBaseUrl)) {
    if (!session || !isValidRole(session.user?.role)) {
      return new Response(
        JSON.stringify({
          message: 'Not authorized'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return NextResponse.next();
  }

  // FRONT
  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPage}`;

    return NextResponse.redirect(url);
  }

  if (!isValidRole(session.user?.role)) {
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

const isValidRole = (role: string = '') => {
  const validRoles = ['admin', 'super-admin', 'dev'];
  return validRoles.includes(role);
};

export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*']
};
