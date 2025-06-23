import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { id, name, email, department, password } = body;

      // Validate required fields
      if (!id || !name || !email || !department || !password) {
         return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
         );
      }

      // Check if admin already exists
      const existingAdmin = await prisma.employee.findUnique({
         where: { id: id },
      });

      if (existingAdmin) {
         return NextResponse.json(
            { error: "Admin user already exists" },
            { status: 409 }
         );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      const admin = await prisma.employee.create({
         data: {
            id,
            name,
            email,
            department,
            password: hashedPassword,
         },
      });

      // Return admin data without password
      const { password: _, ...adminData } = admin;

      return NextResponse.json(
         {
            message: "Admin user created successfully",
            admin: adminData,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error creating admin user:", error);
      return NextResponse.json(
         { error: "Failed to create admin user" },
         { status: 500 }
      );
   }
}
