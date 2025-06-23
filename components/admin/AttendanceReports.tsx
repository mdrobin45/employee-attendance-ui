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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ReportData {
   employeeId: string;
   employeeName: string;
   department: string;
   presentDays: number;
   absentDays: number;
   extraDays: number;
   totalHours: number;
   averageHoursPerDay: number;
   attendanceRate: number;
}

export default function AttendanceReports() {
   const [reportType, setReportType] = useState("monthly");
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   const [departmentFilter, setDepartmentFilter] = useState("all");
   const [reportData, setReportData] = useState<ReportData[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      generateReport();
   }, [reportType, selectedMonth, selectedYear, departmentFilter]);

   const generateReport = async () => {
      setIsLoading(true);
      try {
         // Mock data - in real app, fetch from API
         const mockData: ReportData[] = [
            {
               employeeId: "EMP001",
               employeeName: "John Doe",
               department: "Engineering",
               presentDays: 18,
               absentDays: 2,
               extraDays: 3,
               totalHours: 144.5,
               averageHoursPerDay: 8.0,
               attendanceRate: 90.0,
            },
            {
               employeeId: "EMP002",
               employeeName: "Jane Smith",
               department: "Marketing",
               presentDays: 19,
               absentDays: 1,
               extraDays: 2,
               totalHours: 152.0,
               averageHoursPerDay: 8.0,
               attendanceRate: 95.0,
            },
            {
               employeeId: "EMP003",
               employeeName: "Mike Johnson",
               department: "Sales",
               presentDays: 17,
               absentDays: 3,
               extraDays: 4,
               totalHours: 136.0,
               averageHoursPerDay: 8.0,
               attendanceRate: 85.0,
            },
            {
               employeeId: "EMP004",
               employeeName: "Sarah Wilson",
               department: "HR",
               presentDays: 16,
               absentDays: 4,
               extraDays: 1,
               totalHours: 128.0,
               averageHoursPerDay: 8.0,
               attendanceRate: 80.0,
            },
         ];

         // Apply department filter
         const filteredData =
            departmentFilter === "all"
               ? mockData
               : mockData.filter((emp) => emp.department === departmentFilter);

         setReportData(filteredData);
      } catch (error) {
         console.error("Error generating report:", error);
         toast.error("Failed to generate report");
      } finally {
         setIsLoading(false);
      }
   };

   const exportReport = async (format: "csv" | "pdf" | "excel") => {
      try {
         // In real app, this would call the API to export
         toast.success(`Report exported as ${format.toUpperCase()}`);
      } catch (error) {
         console.error("Error exporting report:", error);
         toast.error("Failed to export report");
      }
   };

   const getAttendanceRateColor = (rate: number) => {
      if (rate >= 90) return "text-green-600";
      if (rate >= 80) return "text-yellow-600";
      return "text-red-600";
   };

   const getAttendanceRateBadge = (rate: number) => {
      if (rate >= 90)
         return (
            <Badge variant="default" className="bg-green-100 text-green-800">
               Excellent
            </Badge>
         );
      if (rate >= 80)
         return (
            <Badge
               variant="secondary"
               className="bg-yellow-100 text-yellow-800">
               Good
            </Badge>
         );
      return <Badge variant="destructive">Needs Attention</Badge>;
   };

   const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];

   const years = Array.from(
      { length: 5 },
      (_, i) => new Date().getFullYear() - i
   );

   const departments = Array.from(
      new Set(reportData.map((emp) => emp.department))
   );

   const totalStats = reportData.reduce(
      (acc, emp) => ({
         presentDays: acc.presentDays + emp.presentDays,
         absentDays: acc.absentDays + emp.absentDays,
         extraDays: acc.extraDays + emp.extraDays,
         totalHours: acc.totalHours + emp.totalHours,
         averageRate: acc.averageRate + emp.attendanceRate,
      }),
      {
         presentDays: 0,
         absentDays: 0,
         extraDays: 0,
         totalHours: 0,
         averageRate: 0,
      }
   );

   const averageAttendanceRate =
      reportData.length > 0 ? totalStats.averageRate / reportData.length : 0;

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold">Attendance Reports</h2>
               <p className="text-gray-600">
                  Generate and view attendance reports
               </p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => exportReport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
               </Button>
               <Button variant="outline" onClick={() => exportReport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
               </Button>
               <Button variant="outline" onClick={() => exportReport("excel")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
               </Button>
            </div>
         </div>

         {/* Filters */}
         <Card>
            <CardContent className="pt-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                     <label className="text-sm font-medium mb-2 block">
                        Report Type
                     </label>
                     <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="monthly">
                              Monthly Report
                           </SelectItem>
                           <SelectItem value="weekly">Weekly Report</SelectItem>
                           <SelectItem value="daily">Daily Report</SelectItem>
                           <SelectItem value="custom">Custom Period</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <label className="text-sm font-medium mb-2 block">
                        Month
                     </label>
                     <Select
                        value={selectedMonth.toString()}
                        onValueChange={(value) =>
                           setSelectedMonth(parseInt(value))
                        }>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {months.map((month, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                 {month}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <label className="text-sm font-medium mb-2 block">
                        Year
                     </label>
                     <Select
                        value={selectedYear.toString()}
                        onValueChange={(value) =>
                           setSelectedYear(parseInt(value))
                        }>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                 {year}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <label className="text-sm font-medium mb-2 block">
                        Department
                     </label>
                     <Select
                        value={departmentFilter}
                        onValueChange={setDepartmentFilter}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">All Departments</SelectItem>
                           {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                 {dept}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Summary Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
               <CardContent className="pt-6">
                  <div className="text-center">
                     <div className="text-2xl font-bold text-green-600">
                        {totalStats.presentDays}
                     </div>
                     <div className="text-sm text-gray-500">
                        Total Present Days
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6">
                  <div className="text-center">
                     <div className="text-2xl font-bold text-red-600">
                        {totalStats.absentDays}
                     </div>
                     <div className="text-sm text-gray-500">
                        Total Absent Days
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6">
                  <div className="text-center">
                     <div className="text-2xl font-bold text-blue-600">
                        {totalStats.extraDays}
                     </div>
                     <div className="text-sm text-gray-500">
                        Total Extra Days
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6">
                  <div className="text-center">
                     <div
                        className={`text-2xl font-bold ${getAttendanceRateColor(
                           averageAttendanceRate
                        )}`}>
                        {averageAttendanceRate.toFixed(1)}%
                     </div>
                     <div className="text-sm text-gray-500">
                        Average Attendance Rate
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Report Table */}
         <Card>
            <CardHeader>
               <CardTitle>
                  {months[selectedMonth]} {selectedYear} Attendance Report
               </CardTitle>
               <CardDescription>
                  Detailed attendance breakdown for all employees
               </CardDescription>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                     <p className="mt-2 text-gray-600">Generating report...</p>
                  </div>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Employee</TableHead>
                           <TableHead>Department</TableHead>
                           <TableHead>Present Days</TableHead>
                           <TableHead>Absent Days</TableHead>
                           <TableHead>Extra Days</TableHead>
                           <TableHead>Total Hours</TableHead>
                           <TableHead>Avg Hours/Day</TableHead>
                           <TableHead>Attendance Rate</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {reportData.map((employee) => (
                           <TableRow key={employee.employeeId}>
                              <TableCell>
                                 <div>
                                    <div className="font-medium">
                                       {employee.employeeName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                       ID: {employee.employeeId}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline">
                                    {employee.department}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium text-green-600">
                                       {employee.presentDays}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium text-red-600">
                                       {employee.absentDays}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium text-blue-600">
                                       {employee.extraDays}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium">
                                       {employee.totalHours}h
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium">
                                       {employee.averageHoursPerDay}h
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    <div
                                       className={`font-medium ${getAttendanceRateColor(
                                          employee.attendanceRate
                                       )}`}>
                                       {employee.attendanceRate}%
                                    </div>
                                    {getAttendanceRateBadge(
                                       employee.attendanceRate
                                    )}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}

               {!isLoading && reportData.length === 0 && (
                  <div className="text-center py-8">
                     <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <p className="text-gray-600">
                        No data available for the selected criteria
                     </p>
                     <p className="text-sm text-gray-500">
                        Try adjusting your filters
                     </p>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
