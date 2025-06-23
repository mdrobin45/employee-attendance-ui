import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

async function seedAdmin() {
   try {
      // Check if admin already exists
      const existingAdmin = await prisma.employee.findUnique({
         where: { id: "ADMIN001" },
      });

      if (existingAdmin) {
         console.log("Admin user already exists");
         console.log("Login credentials:");
         console.log("Employee ID: ADMIN001");
         console.log("Password: admin123");
         return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create admin user
      const admin = await prisma.employee.create({
         data: {
            id: "ADMIN001",
            name: "Admin User",
            email: "admin@company.com",
            department: "admin",
            password: hashedPassword,
         },
      });

      console.log("Admin user created successfully:", {
         id: admin.id,
         name: admin.name,
         email: admin.email,
         department: admin.department,
      });

      console.log("\nLogin credentials:");
      console.log("Employee ID: ADMIN001");
      console.log("Password: admin123");
      console.log("\nYou can now login and access the admin panel at /admin");
   } catch (error) {
      console.error("Error creating admin user:", error);
   } finally {
      await prisma.$disconnect();
   }
}

seedAdmin();
