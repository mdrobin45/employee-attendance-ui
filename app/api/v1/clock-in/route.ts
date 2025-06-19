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

      // Check if employee already has an active clock-in (no clock-out)
      const existingRecord = await prisma.records.findFirst({
         where: {
            employeeId: employeeId,
            clockOut: null,
         },
      });

      if (existingRecord) {
         return NextResponse.json(
            { message: "Employee is already clocked in" },
            { status: 400 }
         );
      }

      // Create new clock-in record
      const response = await prisma.records.create({
         data: {
            employeeId: employeeId,
            clockIn: new Date(),
            clockOut: null,
         },
      });

      if (!response) {
         return NextResponse.json(
            { message: "Clock in failed" },
            { status: 500 }
         );
      }

      return NextResponse.json(
         {
            message: "Clock in successful",
            record: {
               id: response.id,
               employeeId: response.employeeId,
               clockIn: response.clockIn,
               clockOut: response.clockOut,
            },
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Clock-in error:", error);
      return NextResponse.json(
         { message: "Internal server error" },
         { status: 500 }
      );
   }
};
