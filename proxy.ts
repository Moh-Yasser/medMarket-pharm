
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './lib/isAuthenticated';


const notProtectedRoutes = '/login';

export async function proxy(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const isProtectedRoute = path !== notProtectedRoutes
  const isNotProtectedRoute =path=== notProtectedRoutes
  const authResult = await isAuthenticated(req);

  if (isProtectedRoute) {
    if (!authResult.success) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  if (isNotProtectedRoute) {
    if (authResult.success) { 
      return NextResponse.redirect(new URL("/products", req.nextUrl)); 
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ],

}

  




