/*
  Warnings:

  - You are about to drop the column `employeeID` on the `employee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "employee_employeeID_key";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "employeeID";
