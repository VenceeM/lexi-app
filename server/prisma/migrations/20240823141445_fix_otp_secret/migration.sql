/*
  Warnings:

  - You are about to alter the column `otp_secret` on the `otp` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "otp_secret" SET DATA TYPE VARCHAR(255);
