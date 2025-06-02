"use client";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userLogin } from "@/services/userService";
import { useState } from "react";
import toast from "react-hot-toast";
export default function SignInPage() {
   const [data, setData] = useState<any>({
      email: "",
      password: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
   };

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const response = await userLogin(data.email, data.password);
         if (response) {
            toast.success("Login successful");
         }
      } catch (error: any) {
         toast.error(error.response.data.message);
      }
   };
   return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">
                  Employee Attendance
               </CardTitle>
               <CardDescription className="text-center">
                  Enter your email and password to sign in
               </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        placeholder="Enter your email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        required
                     />
                  </div>
               </CardContent>
               <CardFooter>
                  <Button type="submit" className="w-full">
                     Sign In
                  </Button>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
