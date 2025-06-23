"use client";

import AttendanceReports from "@/components/admin/AttendanceReports";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import SystemOverview from "@/components/admin/SystemOverview";
import WorkingDayConfigPanel from "@/components/admin/WorkingDayConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   AlertCircle,
   Calendar,
   CheckCircle,
   Clock,
   FileText,
   Settings,
   TrendingUp,
   Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminStats {
   totalEmployees: number;
   activeEmployees: number;
   totalRecords: number;
   todayRecords: number;
   pendingApprovals: number;
   systemStatus: "healthy" | "warning" | "error";
}

export default function AdminDashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [stats, setStats] = useState<AdminStats>({
      totalEmployees: 0,
      activeEmployees: 0,
      totalRecords: 0,
      todayRecords: 0,
      pendingApprovals: 0,
      systemStatus: "healthy",
   });

   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/login");
      }
      // Check if user has admin role
      if (status === "authenticated" && session?.user?.department !== "admin") {
         router.push("/");
      }
   }, [session, status, router]);

   useEffect(() => {
      fetchAdminStats();
   }, []);

   const fetchAdminStats = async () => {
      try {
         // In a real implementation, this would fetch from your API
         const mockStats: AdminStats = {
            totalEmployees: 25,
            activeEmployees: 18,
            totalRecords: 1250,
            todayRecords: 15,
            pendingApprovals: 3,
            systemStatus: "healthy",
         };
         setStats(mockStats);
      } catch (error) {
         console.error("Error fetching admin stats:", error);
      }
   };

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
            </div>
         </div>
      );
   }

   if (status === "unauthenticated") {
      return null;
   }

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
               <div className="flex justify-between items-center">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900">
                        Admin Dashboard
                     </h1>
                     <p className="text-gray-600">
                        Attendance Management System
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-600">
                           {session?.user?.name} (Admin)
                        </span>
                     </div>
                     <Button variant="outline" onClick={() => router.push("/")}>
                        Back to Employee View
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 py-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Total Employees
                     </CardTitle>
                     <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {stats.totalEmployees}
                     </div>
                     <p className="text-xs text-muted-foreground">
                        {stats.activeEmployees} currently active
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Today's Records
                     </CardTitle>
                     <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {stats.todayRecords}
                     </div>
                     <p className="text-xs text-muted-foreground">
                        {stats.totalRecords} total records
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Pending Approvals
                     </CardTitle>
                     <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {stats.pendingApprovals}
                     </div>
                     <p className="text-xs text-muted-foreground">
                        Require attention
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        System Status
                     </CardTitle>
                     {stats.systemStatus === "healthy" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                     ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                     )}
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-center gap-2">
                        <Badge
                           variant={
                              stats.systemStatus === "healthy"
                                 ? "default"
                                 : "secondary"
                           }
                           className="capitalize">
                           {stats.systemStatus}
                        </Badge>
                     </div>
                     <p className="text-xs text-muted-foreground mt-1">
                        All systems operational
                     </p>
                  </CardContent>
               </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
               <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger
                     value="overview"
                     className="flex items-center gap-2">
                     <TrendingUp className="h-4 w-4" />
                     Overview
                  </TabsTrigger>
                  <TabsTrigger
                     value="employees"
                     className="flex items-center gap-2">
                     <Users className="h-4 w-4" />
                     Employees
                  </TabsTrigger>
                  <TabsTrigger
                     value="reports"
                     className="flex items-center gap-2">
                     <FileText className="h-4 w-4" />
                     Reports
                  </TabsTrigger>
                  <TabsTrigger
                     value="calendar"
                     className="flex items-center gap-2">
                     <Calendar className="h-4 w-4" />
                     Calendar
                  </TabsTrigger>
                  <TabsTrigger
                     value="settings"
                     className="flex items-center gap-2">
                     <Settings className="h-4 w-4" />
                     Settings
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-6">
                  <SystemOverview />
               </TabsContent>

               <TabsContent value="employees" className="space-y-6">
                  <EmployeeManagement />
               </TabsContent>

               <TabsContent value="reports" className="space-y-6">
                  <AttendanceReports />
               </TabsContent>

               <TabsContent value="calendar" className="space-y-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Attendance Calendar</CardTitle>
                        <CardDescription>
                           View attendance patterns and holidays
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="text-center py-8 text-gray-500">
                           Calendar view coming soon...
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="settings" className="space-y-6">
                  <WorkingDayConfigPanel />
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}
