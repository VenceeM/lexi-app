/*
  Warnings:

  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectMemberStatus" AS ENUM ('INVITED', 'PENDING', 'APPROVED', 'REJECTED', 'INACTIVE', 'BANNED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "status" "ProjectMemberStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';
