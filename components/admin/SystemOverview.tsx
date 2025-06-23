"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   AlertTriangle,
   CheckCircle,
   Clock,
   FileText,
   Settings,
   TrendingDown,
   TrendingUp,
   Users,
   XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceTrend {
   date: string;
   present: number;
   absent: number;
   extra: number;
   total: number;
}

interface SystemHealth {
   database: "healthy" | "warning" | "error";
   api: "healthy" | "warning" | "error";
   authentication: "healthy" | "warning" | "error";
   lastChecked: string;
}

export default function SystemOverview() {
   const [trends, setTrends] = useState<AttendanceTrend[]>([]);
   const [health, setHealth] = useState<SystemHealth>({
      database: "healthy",
      api: "healthy",
      authentication: "healthy",
      lastChecked: new Date().toISOString(),
   });

   useEffect(() => {
      fetchTrends();
      checkSystemHealth();
   }, []);

   const fetchTrends = async () => {
      // Mock data - in real app, fetch from API
      const mockTrends: AttendanceTrend[] = [
         { date: "2024-01-15", present: 18, absent: 2, extra: 3, total: 20 },
         { date: "2024-01-16", present: 19, absent: 1, extra: 2, total: 20 },
         { date: "2024-01-17", present: 17, absent: 3, extra: 4, total: 20 },
         { date: "2024-01-18", present: 20, absent: 0, extra: 1, total: 20 },
         { date: "2024-01-19", present: 16, absent: 4, extra: 5, total: 20 },
         { date: "2024-01-20", present: 15, absent: 5, extra: 6, total: 20 },
         { date: "2024-01-21", present: 18, absent: 2, extra: 3, total: 20 },
      ];
      setTrends(mockTrends);
   };

   const checkSystemHealth = async () => {
      // Mock health check - in real app, ping actual services
      const mockHealth: SystemHealth = {
         database: "healthy",
         api: "healthy",
         authentication: "healthy",
         lastChecked: new Date().toISOString(),
      };
      setHealth(mockHealth);
   };

   const getHealthIcon = (status: string) => {
      switch (status) {
         case "healthy":
            return <CheckCircle className="h-4 w-4 text-green-600" />;
         case "warning":
            return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
         case "error":
            return <XCircle className="h-4 w-4 text-red-600" />;
         default:
            return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      }
   };

   const getHealthBadge = (status: string) => {
      switch (status) {
         case "healthy":
            return (
               <Badge variant="default" className="bg-green-100 text-green-800">
                  Healthy
               </Badge>
            );
         case "warning":
            return (
               <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800">
                  Warning
               </Badge>
            );
         case "error":
            return <Badge variant="destructive">Error</Badge>;
         default:
            return <Badge variant="outline">Unknown</Badge>;
      }
   };

   const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
   };

   const latestTrend = trends[trends.length - 1];
   const previousTrend = trends[trends.length - 2];
   const attendanceTrend = previousTrend
      ? calculateTrend(latestTrend?.present || 0, previousTrend.present)
      : 0;

   return (
      <div className="space-y-6">
         {/* System Health */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  System Health
               </CardTitle>
               <CardDescription>
                  Current status of all system components
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                     <div className="flex items-center gap-2">
                        {getHealthIcon(health.database)}
                        <span className="font-medium">Database</span>
                     </div>
                     {getHealthBadge(health.database)}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                     <div className="flex items-center gap-2">
                        {getHealthIcon(health.api)}
                        <span className="font-medium">API</span>
                     </div>
                     {getHealthBadge(health.api)}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                     <div className="flex items-center gap-2">
                        {getHealthIcon(health.authentication)}
                        <span className="font-medium">Authentication</span>
                     </div>
                     {getHealthBadge(health.authentication)}
                  </div>
               </div>

               <div className="mt-4 text-sm text-gray-500">
                  Last checked: {new Date(health.lastChecked).toLocaleString()}
               </div>
            </CardContent>
         </Card>

         {/* Attendance Overview */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5" />
                     Attendance Trends
                  </CardTitle>
                  <CardDescription>
                     Last 7 days attendance overview
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {latestTrend && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">
                              Today's Attendance
                           </span>
                           <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">
                                 {latestTrend.present}
                              </span>
                              <span className="text-sm text-gray-500">
                                 / {latestTrend.total}
                              </span>
                              {attendanceTrend !== 0 && (
                                 <div
                                    className={`flex items-center gap-1 text-sm ${
                                       attendanceTrend > 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                    }`}>
                                    {attendanceTrend > 0 ? (
                                       <TrendingUp className="h-3 w-3" />
                                    ) : (
                                       <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(attendanceTrend).toFixed(1)}%
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                           <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                 {latestTrend.present}
                              </div>
                              <div className="text-xs text-gray-500">
                                 Present
                              </div>
                           </div>
                           <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">
                                 {latestTrend.absent}
                              </div>
                              <div className="text-xs text-gray-500">
                                 Absent
                              </div>
                           </div>
                           <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                 {latestTrend.extra}
                              </div>
                              <div className="text-xs text-gray-500">
                                 Extra Days
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Clock className="h-5 w-5" />
                     Recent Activity
                  </CardTitle>
                  <CardDescription>
                     Latest system activities and events
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                           <div className="text-sm font-medium">
                              Configuration Updated
                           </div>
                           <div className="text-xs text-gray-500">
                              Working days configuration saved
                           </div>
                        </div>
                        <div className="text-xs text-gray-400">2 min ago</div>
                     </div>

                     <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                        <Users className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                           <div className="text-sm font-medium">
                              New Employee Added
                           </div>
                           <div className="text-xs text-gray-500">
                              John Doe joined the system
                           </div>
                        </div>
                        <div className="text-xs text-gray-400">15 min ago</div>
                     </div>

                     <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div className="flex-1">
                           <div className="text-sm font-medium">
                              Attendance Alert
                           </div>
                           <div className="text-xs text-gray-500">
                              3 employees late today
                           </div>
                        </div>
                        <div className="text-xs text-gray-400">1 hour ago</div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Quick Actions */}
         <Card>
            <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
               <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                     variant="outline"
                     className="h-20 flex flex-col gap-2">
                     <Users className="h-6 w-6" />
                     <span>Manage Employees</span>
                  </Button>

                  <Button
                     variant="outline"
                     className="h-20 flex flex-col gap-2">
                     <FileText className="h-6 w-6" />
                     <span>Generate Reports</span>
                  </Button>

                  <Button
                     variant="outline"
                     className="h-20 flex flex-col gap-2">
                     <Settings className="h-6 w-6" />
                     <span>System Settings</span>
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
