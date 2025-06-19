import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            id: { label: "Employee ID", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.id || !credentials?.password) {
               return null;
            }

            try {
               // Find employee by ID
               const employee = await prisma.employee.findUnique({
                  where: { id: credentials.id as string },
               });

               if (!employee) {
                  return null;
               }

               // Verify password
               const isPasswordValid = await bcrypt.compare(
                  credentials.password as string,
                  employee.password
               );

               if (!isPasswordValid) {
                  return null;
               }

               // Return user object (without password)
               return {
                  id: employee.id,
                  name: employee.name,
                  email: employee.email,
                  department: employee.department,
               };
            } catch (error) {
               console.error("Auth error:", error);
               return null;
            }
         },
      }),
   ],
   session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id;
            token.department = user.department;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.id as string;
            session.user.department = token.department as string;
         }
         return session;
      },
   },
   pages: {
      signIn: "/login",
      error: "/login",
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
