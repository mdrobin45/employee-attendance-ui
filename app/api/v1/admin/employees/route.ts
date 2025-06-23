import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      // In a real implementation, this would fetch from your database
      const employees = [
         {
            id: "EMP001",
            name: "John Doe",
            email: "john.doe@company.com",
            department: "Engineering",
            status: "active" as const,
            lastActive: "2024-01-21T09:30:00Z",
            totalRecords: 45,
            currentStatus: "clocked-in" as const,
         },
         {
            id: "EMP002",
            name: "Jane Smith",
            email: "jane.smith@company.com",
            department: "Marketing",
            status: "active" as const,
            lastActive: "2024-01-21T08:45:00Z",
            totalRecords: 38,
            currentStatus: "clocked-in" as const,
         },
         {
            id: "EMP003",
            name: "Mike Johnson",
            email: "mike.johnson@company.com",
            department: "Sales",
            status: "active" as const,
            lastActive: "2024-01-20T17:30:00Z",
            totalRecords: 52,
            currentStatus: "clocked-out" as const,
         },
         {
            id: "EMP004",
            name: "Sarah Wilson",
            email: "sarah.wilson@company.com",
            department: "HR",
            status: "inactive" as const,
            lastActive: "2024-01-15T16:00:00Z",
            totalRecords: 28,
            currentStatus: "unknown" as const,
         },
      ];

      return NextResponse.json(employees);
   } catch (error) {
      console.error("Error fetching employees:", error);
      return NextResponse.json(
         { error: "Failed to fetch employees" },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { employeeId, name, email, department } = body;

      // Validate required fields
      if (!employeeId || !name || !email || !department) {
         return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
         );
      }

      // In a real implementation, this would save to your database
      const newEmployee = {
         id: employeeId,
         name,
         email,
         department,
         status: "active" as const,
         lastActive: new Date().toISOString(),
         totalRecords: 0,
         currentStatus: "unknown" as const,
      };

      return NextResponse.json(newEmployee, { status: 201 });
   } catch (error) {
      console.error("Error creating employee:", error);
      return NextResponse.json(
         { error: "Failed to create employee" },
         { status: 500 }
      );
   }
}
