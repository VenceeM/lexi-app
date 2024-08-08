/*
  Warnings:

  - You are about to drop the column `user_id` on the `Roles` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `user_information_id` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `UserInformations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserInformations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Roles" DROP CONSTRAINT "Roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_refreshTokenId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_user_information_id_fkey";

-- DropIndex
DROP INDEX "Users_user_information_id_key";

-- AlterTable
ALTER TABLE "RefreshTokens" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Roles" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "UserInformations" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "refreshTokenId",
DROP COLUMN "user_information_id",
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserInformations_user_id_key" ON "UserInformations"("user_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInformations" ADD CONSTRAINT "UserInformations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
