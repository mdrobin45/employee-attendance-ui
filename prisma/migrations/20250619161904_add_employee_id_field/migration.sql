/*
  Warnings:

  - A unique constraint covering the columns `[employeeID]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeID` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employeeID" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "records" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeID_key" ON "employee"("employeeID");
