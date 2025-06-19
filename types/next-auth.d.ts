import "next-auth";

declare module "next-auth" {
   interface User {
      id: string;
      name: string;
      email: string;
      department: string;
   }

   interface Session {
      user: {
         id: string;
         name: string;
         email: string;
         department: string;
      };
   }
}

declare module "next-auth/jwt" {
   interface JWT {
      id: string;
      department: string;
   }
}
