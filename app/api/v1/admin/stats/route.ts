import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   try {
      // In a real implementation, this would fetch from your database
      const stats = {
         totalEmployees: 25,
         activeEmployees: 18,
         totalRecords: 1250,
         todayRecords: 15,
         pendingApprovals: 3,
         systemStatus: "healthy" as const,
         departments: ["Engineering", "Marketing", "Sales", "HR"],
         recentActivity: [
            {
               type: "config_update",
               message: "Working days configuration saved",
               timestamp: new Date().toISOString(),
               user: "Admin User",
            },
            {
               type: "employee_added",
               message: "New employee added: John Doe",
               timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
               user: "Admin User",
            },
            {
               type: "attendance_alert",
               message: "3 employees late today",
               timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
               user: "System",
            },
         ],
      };

      return NextResponse.json(stats);
   } catch (error) {
      console.error("Error fetching admin stats:", error);
      return NextResponse.json(
         { error: "Failed to fetch admin statistics" },
         { status: 500 }
      );
   }
}
