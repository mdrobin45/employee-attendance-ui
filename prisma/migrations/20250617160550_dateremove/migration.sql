/*
  Warnings:

  - You are about to drop the column `date` on the `records` table. All the data in the column will be lost.
  - Changed the type of `clockIn` on the `records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clockOut` on the `records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "records" DROP COLUMN "date",
DROP COLUMN "clockIn",
ADD COLUMN     "clockIn" TIMESTAMP(3) NOT NULL,
DROP COLUMN "clockOut",
ADD COLUMN     "clockOut" TIMESTAMP(3) NOT NULL;
