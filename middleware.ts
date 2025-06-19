import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
   function middleware(req) {
      const { pathname } = req.nextUrl;

      // Redirect to dashboard if authenticated and on login page
      if (req.nextauth.token && pathname === "/login") {
         return NextResponse.redirect(new URL("/", req.url));
      }
   },
   {
      callbacks: {
         authorized: ({ token, req }) => {
            const { pathname } = req.nextUrl;

            // Allow access to login page without authentication
            if (pathname === "/login") {
               return true;
            }

            // Require authentication for all other routes
            return !!token;
         },
      },
   }
);

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
