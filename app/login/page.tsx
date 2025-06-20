"use client";

import type React from "react";

import logo from "@/assets/wwg_logo_horizontal.webp";
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
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Component() {
   const [employeeId, setEmployeeId] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         const result = await signIn("credentials", {
            id: employeeId,
            password: password,
            redirect: false,
         });

         if (result?.error) {
            setError("Invalid employee ID or password");
         } else {
            router.push("/");
            router.refresh();
         }
      } catch (error) {
         setError("An error occurred. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="flex justify-center mb-4">
                  <Image
                     width={200}
                     height={100}
                     src={logo}
                     alt="Way Wise Global"
                  />
               </div>
               <CardTitle className="text-2xl font-bold">
                  Daily Attendance
               </CardTitle>
               <CardDescription>
                  Enter your employee credentials to access your account
               </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="employeeId">Employee ID</Label>
                     <Input
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        placeholder="e.g., WWT123"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                     />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
               </CardContent>

               <CardFooter className="flex flex-col space-y-4">
                  <Button disabled={isLoading} type="submit" className="w-full">
                     {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  <div className="text-center">
                     <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline">
                        Forgot your password?
                     </a>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
