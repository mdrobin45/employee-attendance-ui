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
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   calculateAdjustedAttendanceStats,
   calculateHoursForDate,
   formatHoursToHoursMinutes,
   type AttendanceRecord,
   type WorkingDayConfig,
} from "@/lib/attendanceUtils";
import { configManager } from "@/lib/configManager";
import { Clock, LogIn, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EmployeeData {
   employee: {
      id: string;
      name: string;
      email: string;
      department: string;
   };
   records: AttendanceRecord[];
   summary: {
      totalRecords: number;
      activeRecord: boolean;
      completedRecords: number;
      totalHoursWorked: number;
   };
}

export default function AttendancePage() {
   const { data: session, status } = useSession();
   const [currentTime, setCurrentTime] = useState(new Date());
   const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [workingDayConfig, setWorkingDayConfig] =
      useState<WorkingDayConfig | null>(null);

   // Update current time every second
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   // Fetch working day configuration
   useEffect(() => {
      const fetchConfig = async () => {
         try {
            const config = await configManager.getWorkingDayConfig();
            setWorkingDayConfig(config);
         } catch (error) {
            console.error("Error fetching working day config:", error);
            // Use default config if fetch fails
            setWorkingDayConfig(null);
         }
      };

      fetchConfig();
   }, []);

   // Fetch employee data when session is available
   useEffect(() => {
      if (session?.user?.id) {
         fetchEmployeeData();
      }
   }, [session]);

   const fetchEmployeeData = async () => {
      if (!session?.user?.id) return;

      try {
         const response = await fetch(
            `/api/v1/employee/${session.user.id}/records`
         );
         if (response.ok) {
            const data = await response.json();
            setEmployeeData(data);
         } else {
            setError("Failed to fetch attendance data");
            toast.error("Failed to fetch attendance data");
         }
      } catch (error) {
         setError("Error fetching attendance data");
         toast.error("Error fetching attendance data");
      }
   };

   const handleClockIn = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      setError("");

      const clockInToast = toast.loading("Clocking in...");

      try {
         const response = await fetch("/api/v1/clock-in", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               employeeId: session.user.id,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            toast.success(
               `Successfully clocked in at ${new Date().toLocaleTimeString()}`,
               {
                  id: clockInToast,
               }
            );
            await fetchEmployeeData(); // Refresh data
         } else {
            const data = await response.json();
            const errorMessage = data.message || "Clock in failed";
            setError(errorMessage);
            toast.error(errorMessage, {
               id: clockInToast,
            });
         }
      } catch (error) {
         const errorMessage = "Error clocking in";
         setError(errorMessage);
         toast.error(errorMessage, {
            id: clockInToast,
         });
      } finally {
         setIsLoading(false);
      }
   };

   const handleClockOut = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      setError("");

      const clockOutToast = toast.loading("Clocking out...");

      try {
         const response = await fetch("/api/v1/clock-out", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               employeeId: session.user.id,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            const hoursWorked = data.record?.totalHours || 0;
            toast.success(
               `Successfully clocked out! Hours worked: ${formatHoursToHoursMinutes(
                  hoursWorked
               )}`,
               {
                  id: clockOutToast,
               }
            );
            await fetchEmployeeData(); // Refresh data
         } else {
            const data = await response.json();
            const errorMessage = data.message || "Clock out failed";
            setError(errorMessage);
            toast.error(errorMessage, {
               id: clockOutToast,
            });
         }
      } catch (error) {
         const errorMessage = "Error clocking out";
         setError(errorMessage);
         toast.error(errorMessage, {
            id: clockOutToast,
         });
      } finally {
         setIsLoading(false);
      }
   };

   const handleLogout = () => {
      toast.success("Logging out...");
      signOut({ callbackUrl: "/login" });
   };

   // Show loading while session is loading
   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   // Redirect to login if not authenticated
   if (status === "unauthenticated") {
      return null; // Middleware will handle redirect
   }

   const isClockedIn = employeeData?.summary.activeRecord || false;

   return (
      <Fragment>
         <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
               <div>
                  <h1 className="text-3xl font-bold">Attendance Management</h1>
                  <p className="text-muted-foreground">
                     Track your work hours and attendance
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                     <User className="h-5 w-5" />
                     <span className="font-medium">{session?.user?.name}</span>
                     <span className="text-muted-foreground">
                        ({session?.user?.department})
                     </span>
                  </div>
                  {session?.user?.department === "admin" && (
                     <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/admin")}
                        className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin Panel
                     </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                     Logout
                  </Button>
               </div>
            </div>

            {error && (
               <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <Card className="col-span-1">
                  <CardHeader>
                     <CardTitle>Current Time</CardTitle>
                     <CardDescription>Your local time</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-col items-center justify-center space-y-2">
                        <Clock className="h-12 w-12 text-primary" />
                        <p className="text-3xl font-bold">
                           {currentTime.toLocaleTimeString()}
                        </p>
                        <p className="text-muted-foreground">
                           {currentTime.toLocaleDateString()}
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="col-span-1 md:col-span-2">
                  <CardHeader>
                     <CardTitle>Clock In/Out</CardTitle>
                     <CardDescription>Record your attendance</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                           size="lg"
                           className="flex items-center gap-2"
                           onClick={handleClockIn}
                           disabled={isClockedIn || isLoading}>
                           <LogIn className="h-5 w-5" />
                           {isLoading ? "Processing..." : "Clock In"}
                        </Button>
                        <Button
                           size="lg"
                           variant={isClockedIn ? "default" : "outline"}
                           className="flex items-center gap-2"
                           onClick={handleClockOut}
                           disabled={!isClockedIn || isLoading}>
                           <LogOut className="h-5 w-5" />
                           {isLoading ? "Processing..." : "Clock Out"}
                        </Button>
                     </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                     <p className="text-sm text-muted-foreground">
                        {isClockedIn
                           ? "You are currently clocked in. Don't forget to clock out at the end of your shift."
                           : "You are currently clocked out. Click 'Clock In' when you start your shift."}
                     </p>
                  </CardFooter>
               </Card>
            </div>

            <Card>
               <CardHeader>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>
                     View your recent attendance records
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Date</TableHead>
                           <TableHead>Clock In</TableHead>
                           <TableHead>Clock Out</TableHead>
                           <TableHead className="text-right">
                              Total Hours
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {employeeData?.records.map((record) => (
                           <TableRow key={record.id}>
                              <TableCell>
                                 {new Date(record.clockIn).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                 {new Date(record.clockIn).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                 {record.clockOut
                                    ? new Date(
                                         record.clockOut
                                      ).toLocaleTimeString()
                                    : "Not clocked out"}
                              </TableCell>
                              <TableCell className="text-right">
                                 {record.totalHours
                                    ? formatHoursToHoursMinutes(
                                         record.totalHours
                                      )
                                    : "-"}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                     {(!employeeData?.records ||
                        employeeData.records.length === 0) && (
                        <TableCaption>
                           No attendance records found.
                        </TableCaption>
                     )}
                  </Table>
               </CardContent>
            </Card>

            {employeeData && (
               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                     <CardContent className="pt-6">
                        <div className="text-center">
                           <p className="text-2xl font-bold">
                              {formatHoursToHoursMinutes(
                                 calculateHoursForDate(
                                    employeeData.records,
                                    new Date()
                                 )
                              )}
                           </p>
                           <p className="text-muted-foreground">Hours Today</p>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="pt-6">
                        <div className="text-center">
                           <p className="text-2xl font-bold text-green-600">
                              {
                                 calculateAdjustedAttendanceStats(
                                    employeeData.records,
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    workingDayConfig || undefined
                                 ).presentDays
                              }
                           </p>
                           <p className="text-muted-foreground">Present Days</p>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="pt-6">
                        <div className="text-center">
                           <p className="text-2xl font-bold text-blue-600">
                              {
                                 calculateAdjustedAttendanceStats(
                                    employeeData.records,
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    workingDayConfig || undefined
                                 ).extraDays
                              }
                           </p>
                           <p className="text-muted-foreground">Extra Days</p>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="pt-6">
                        <div className="text-center">
                           <p className="text-2xl font-bold text-red-600">
                              {
                                 calculateAdjustedAttendanceStats(
                                    employeeData.records,
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    workingDayConfig || undefined
                                 ).adjustedAbsentDays
                              }
                           </p>
                           <p className="text-muted-foreground">Absent Days</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {employeeData && (
               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-3">
                     <div className="flex-shrink-0">
                        <svg
                           className="h-5 w-5 text-blue-600"
                           fill="currentColor"
                           viewBox="0 0 20 20">
                           <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                           />
                        </svg>
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-blue-800">
                           Extra Days System
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                           Working on off days (holidays or closed alternate
                           days) counts as extra days. These extra days can
                           offset future absences, reducing your absent day
                           count.
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </Fragment>
   );
}
