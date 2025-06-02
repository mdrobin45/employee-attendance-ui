import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/sign-in"];

export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;
   const cookieStore = await cookies();

   // Check if the route is a public route
   if (publicRoutes.includes(pathname)) {
      const token = cookieStore.get("access_token");
      if (token) {
         return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
   }

   // For all other routes, check authentication
   const token = cookieStore.get("access_token");
   if (!token) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
   }

   return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
   matcher: ["/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)"],
};
