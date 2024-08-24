/*
  Warnings:

  - You are about to drop the column `age` on the `user_informations` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "user_informations" DROP COLUMN "age",
ADD COLUMN     "gender" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" DEFAULT 'PENDING';
