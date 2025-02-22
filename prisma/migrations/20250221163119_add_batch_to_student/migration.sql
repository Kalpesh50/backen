/*
  Warnings:

  - You are about to drop the column `hodId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Class` table. All the data in the column will be lost.
  - Added the required column `batch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_hodId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "hodId",
DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "batch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "class" TEXT NOT NULL;
