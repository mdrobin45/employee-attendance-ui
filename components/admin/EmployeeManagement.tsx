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
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
   CheckCircle,
   Clock,
   Edit,
   Eye,
   Plus,
   Search,
   Trash2,
   Users,
   XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Employee {
   id: string;
   name: string;
   email: string;
   department: string;
   status: "active" | "inactive";
   lastActive: string;
   totalRecords: number;
   currentStatus: "clocked-in" | "clocked-out" | "unknown";
}

export default function EmployeeManagement() {
   const [employees, setEmployees] = useState<Employee[]>([]);
   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [departmentFilter, setDepartmentFilter] = useState("all");
   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      fetchEmployees();
   }, []);

   useEffect(() => {
      filterEmployees();
   }, [employees, searchTerm, departmentFilter]);

   const fetchEmployees = async () => {
      setIsLoading(true);
      try {
         // Mock data - in real app, fetch from API
         const mockEmployees: Employee[] = [
            {
               id: "EMP001",
               name: "John Doe",
               email: "john.doe@company.com",
               department: "Engineering",
               status: "active",
               lastActive: "2024-01-21T09:30:00Z",
               totalRecords: 45,
               currentStatus: "clocked-in",
            },
            {
               id: "EMP002",
               name: "Jane Smith",
               email: "jane.smith@company.com",
               department: "Marketing",
               status: "active",
               lastActive: "2024-01-21T08:45:00Z",
               totalRecords: 38,
               currentStatus: "clocked-in",
            },
            {
               id: "EMP003",
               name: "Mike Johnson",
               email: "mike.johnson@company.com",
               department: "Sales",
               status: "active",
               lastActive: "2024-01-20T17:30:00Z",
               totalRecords: 52,
               currentStatus: "clocked-out",
            },
            {
               id: "EMP004",
               name: "Sarah Wilson",
               email: "sarah.wilson@company.com",
               department: "HR",
               status: "inactive",
               lastActive: "2024-01-15T16:00:00Z",
               totalRecords: 28,
               currentStatus: "unknown",
            },
         ];
         setEmployees(mockEmployees);
      } catch (error) {
         console.error("Error fetching employees:", error);
         toast.error("Failed to fetch employees");
      } finally {
         setIsLoading(false);
      }
   };

   const filterEmployees = () => {
      let filtered = employees;

      // Search filter
      if (searchTerm) {
         filtered = filtered.filter(
            (emp) =>
               emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               emp.id.toLowerCase().includes(searchTerm.toLowerCase())
         );
      }

      // Department filter
      if (departmentFilter !== "all") {
         filtered = filtered.filter(
            (emp) => emp.department === departmentFilter
         );
      }

      setFilteredEmployees(filtered);
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "clocked-in":
            return <CheckCircle className="h-4 w-4 text-green-600" />;
         case "clocked-out":
            return <XCircle className="h-4 w-4 text-red-600" />;
         default:
            return <Clock className="h-4 w-4 text-gray-600" />;
      }
   };

   const getStatusBadge = (status: string) => {
      switch (status) {
         case "active":
            return (
               <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
               </Badge>
            );
         case "inactive":
            return (
               <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Inactive
               </Badge>
            );
         default:
            return <Badge variant="outline">Unknown</Badge>;
      }
   };

   const getCurrentStatusBadge = (status: string) => {
      switch (status) {
         case "clocked-in":
            return (
               <Badge variant="default" className="bg-green-100 text-green-800">
                  Clocked In
               </Badge>
            );
         case "clocked-out":
            return (
               <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Clocked Out
               </Badge>
            );
         default:
            return <Badge variant="outline">Unknown</Badge>;
      }
   };

   const departments = Array.from(
      new Set(employees.map((emp) => emp.department))
   );

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold">Employee Management</h2>
               <p className="text-gray-600">
                  Manage employees and view their attendance
               </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
               <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                     <Plus className="h-4 w-4" />
                     Add Employee
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Add New Employee</DialogTitle>
                     <DialogDescription>
                        Add a new employee to the attendance system
                     </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input id="employeeId" placeholder="EMP001" />
                     </div>
                     <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" />
                     </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="john.doe@company.com"
                        />
                     </div>
                     <div>
                        <Label htmlFor="department">Department</Label>
                        <Select>
                           <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="engineering">
                                 Engineering
                              </SelectItem>
                              <SelectItem value="marketing">
                                 Marketing
                              </SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="flex justify-end gap-2">
                        <Button
                           variant="outline"
                           onClick={() => setIsAddDialogOpen(false)}>
                           Cancel
                        </Button>
                        <Button
                           onClick={() => {
                              toast.success("Employee added successfully");
                              setIsAddDialogOpen(false);
                           }}>
                           Add Employee
                        </Button>
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         </div>

         {/* Filters */}
         <Card>
            <CardContent className="pt-6">
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                           placeholder="Search employees..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10"
                        />
                     </div>
                  </div>
                  <div className="w-full md:w-48">
                     <Select
                        value={departmentFilter}
                        onValueChange={setDepartmentFilter}>
                        <SelectTrigger>
                           <SelectValue placeholder="All Departments" />
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

         {/* Employee Table */}
         <Card>
            <CardHeader>
               <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
               <CardDescription>
                  View and manage employee information and attendance
               </CardDescription>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                     <p className="mt-2 text-gray-600">Loading employees...</p>
                  </div>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Employee</TableHead>
                           <TableHead>Department</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead>Current Status</TableHead>
                           <TableHead>Last Active</TableHead>
                           <TableHead>Records</TableHead>
                           <TableHead>Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredEmployees.map((employee) => (
                           <TableRow key={employee.id}>
                              <TableCell>
                                 <div>
                                    <div className="font-medium">
                                       {employee.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                       {employee.email}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                       ID: {employee.id}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline">
                                    {employee.department}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 {getStatusBadge(employee.status)}
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    {getStatusIcon(employee.currentStatus)}
                                    {getCurrentStatusBadge(
                                       employee.currentStatus
                                    )}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-sm">
                                    {new Date(
                                       employee.lastActive
                                    ).toLocaleDateString()}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                    {new Date(
                                       employee.lastActive
                                    ).toLocaleTimeString()}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-center">
                                    <div className="font-medium">
                                       {employee.totalRecords}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       records
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                       <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                       <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}

               {!isLoading && filteredEmployees.length === 0 && (
                  <div className="text-center py-8">
                     <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <p className="text-gray-600">No employees found</p>
                     <p className="text-sm text-gray-500">
                        Try adjusting your search or filters
                     </p>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
