import SessionProvider from "@/components/providers/SessionProvider";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
   title: "Attendance System",
   description: "Employee attendance management system",
   generator: "v0.dev",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body>
            <SessionProvider>
               {children}
               <Toaster
                  position="top-center"
                  toastOptions={{
                     duration: 4000,
                     style: {
                        background: "#363636",
                        color: "#fff",
                     },
                     success: {
                        duration: 3000,
                        iconTheme: {
                           primary: "#4ade80",
                           secondary: "#fff",
                        },
                     },
                     error: {
                        duration: 5000,
                        iconTheme: {
                           primary: "#ef4444",
                           secondary: "#fff",
                        },
                     },
                  }}
               />
            </SessionProvider>
         </body>
      </html>
   );
}
