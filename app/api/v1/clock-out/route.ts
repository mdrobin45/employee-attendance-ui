import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
   try {
      const body = await req.json();
      const { employeeId } = body;

      // Validate required fields
      if (!employeeId) {
         return NextResponse.json(
            { message: "Employee ID is required" },
            { status: 400 }
         );
      }

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
         where: { id: employeeId },
      });

      if (!employee) {
         return NextResponse.json(
            { message: "Employee not found" },
            { status: 404 }
         );
      }

      // Find the active clock-in record (no clock-out)
      const activeRecord = await prisma.records.findFirst({
         where: {
            employeeId: employeeId,
            clockOut: null,
         },
      });

      if (!activeRecord) {
         return NextResponse.json(
            { message: "Employee is not currently clocked in" },
            { status: 400 }
         );
      }

      // Update the record with clock-out time
      const updatedRecord = await prisma.records.update({
         where: {
            id: activeRecord.id,
         },
         data: {
            clockOut: new Date(),
         },
      });

      if (!updatedRecord) {
         return NextResponse.json(
            { message: "Clock out failed" },
            { status: 500 }
         );
      }

      // Calculate hours worked for this session
      const clockInTime = new Date(updatedRecord.clockIn);
      const clockOutTime = new Date(updatedRecord.clockOut!);
      const hoursWorked =
         (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      const roundedHours = Math.round(hoursWorked * 100) / 100; // Round to 2 decimal places

      // Update the record with total hours
      const finalRecord = await prisma.records.update({
         where: {
            id: activeRecord.id,
         },
         data: {
            totalHours: roundedHours,
         },
      });

      return NextResponse.json(
         {
            message: "Clock out successful",
            record: {
               id: finalRecord.id,
               employeeId: finalRecord.employeeId,
               clockIn: finalRecord.clockIn,
               clockOut: finalRecord.clockOut,
               totalHours: finalRecord.totalHours,
            },
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Clock-out error:", error);
      return NextResponse.json(
         { message: "Internal server error" },
         { status: 500 }
      );
   }
};
