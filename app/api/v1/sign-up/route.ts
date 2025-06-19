import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
   try {
      const body = await request.json();
      const { id, email, name, password, department } = body;

      // Validate input
      if (!id || !email || !password || !name || !department) {
         return NextResponse.json(
            {
               error: "All fields are required: id, email, name, password, department.",
            },
            { status: 400 }
         );
      }

      // Check if user already exists by email
      const existingUserByEmail = await prisma.employee.findUnique({
         where: { email },
      });

      if (existingUserByEmail) {
         return NextResponse.json(
            { error: "User with this email already exists." },
            { status: 409 }
         );
      }

      // Check if user already exists by id
      const existingUserById = await prisma.employee.findUnique({
         where: { id },
      });

      if (existingUserById) {
         return NextResponse.json(
            { error: "User with this ID already exists." },
            { status: 409 }
         );
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new employee
      const newUser = await prisma.employee.create({
         data: {
            id,
            email,
            name,
            department,
            password: hashedPassword,
         },
         select: {
            id: true,
            email: true,
            name: true,
            department: true,
            // Exclude password from response
         },
      });

      // Respond with the created user
      return NextResponse.json(
         {
            message: "Employee registered successfully",
            user: newUser,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error during sign-up:", error);
      return NextResponse.json(
         { error: "Internal server error." },
         { status: 500 }
      );
   }
};
