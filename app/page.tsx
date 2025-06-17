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
import type { AttendanceRecord } from "@/lib/types";
import { clockIn } from "@/services/attendance";
import { Clock, LogIn, LogOut, User } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

export default function AttendancePage() {
   const [currentTime, setCurrentTime] = useState(new Date());
   const [clockedIn, setClockedIn] = useState(false);
   const [attendanceRecords, setAttendanceRecords] = useState<
      AttendanceRecord[]
   >([]);

   // Update current time every second
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
   }, []);

   const handleClockIn = async () => {
      const newRecord: AttendanceRecord = {
         clockIn: new Date().toISOString(),
         employeeId: "ID",
      };

      const response = await clockIn(newRecord);
      if (response) {
         setClockedIn(true);
      }
   };

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
                     <span className="font-medium">Robin</span>
                     <span className="text-muted-foreground">(IT)</span>
                  </div>
                  <Button variant="outline">Logout</Button>
               </div>
            </div>

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
                           disabled={clockedIn}>
                           <LogIn className="h-5 w-5" />
                           Clock In
                        </Button>
                        <Button
                           size="lg"
                           variant={clockedIn ? "default" : "outline"}
                           className="flex items-center gap-2"
                           // onClick={handleClockOut}
                           disabled={!clockedIn}>
                           <LogOut className="h-5 w-5" />
                           Clock Out
                        </Button>
                     </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                     <p className="text-sm text-muted-foreground">
                        {clockedIn
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
                        {attendanceRecords.map((record) => (
                           <TableRow>
                              <TableCell>10</TableCell>
                              <TableCell>{record.clockIn}</TableCell>
                              <TableCell>
                                 {record.clockOut || "Not clocked out"}
                              </TableCell>
                              <TableCell className="text-right">10</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                     {attendanceRecords.length === 0 && (
                        <TableCaption>
                           No attendance records found.
                        </TableCaption>
                     )}
                  </Table>
               </CardContent>
            </Card>
         </div>
      </Fragment>
   );
}
