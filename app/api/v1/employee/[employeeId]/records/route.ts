import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
   request: NextRequest,
   { params }: { params: Promise<{ employeeId: string }> }
) => {
   try {
      const { employeeId } = await params;

      // Validate employeeId parameter
      if (!employeeId) {
         return NextResponse.json(
            { error: "Employee ID is required" },
            { status: 400 }
         );
      }

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
         where: { id: employeeId },
         select: {
            id: true,
            name: true,
            email: true,
            department: true,
         },
      });

      if (!employee) {
         return NextResponse.json(
            { error: "Employee not found" },
            { status: 404 }
         );
      }

      // Get all records for the employee
      const records = await prisma.records.findMany({
         where: {
            employeeId: employeeId,
         },
         orderBy: {
            clockIn: "desc", // Most recent first
         },
         select: {
            id: true,
            clockIn: true,
            clockOut: true,
            totalHours: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      // Calculate summary statistics
      const totalRecords = records.length;
      const activeRecord = records.find((record) => record.clockOut === null);
      const completedRecords = records.filter(
         (record) => record.clockOut !== null
      );

      // Calculate total hours worked (using stored totalHours field)
      const totalHours = completedRecords.reduce((total, record) => {
         return total + (record.totalHours || 0);
      }, 0);

      return NextResponse.json(
         {
            employee: {
               id: employee.id,
               name: employee.name,
               email: employee.email,
               department: employee.department,
            },
            records: records,
            summary: {
               totalRecords,
               activeRecord: activeRecord ? true : false,
               completedRecords: completedRecords.length,
               totalHoursWorked: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
            },
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching employee records:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
};
