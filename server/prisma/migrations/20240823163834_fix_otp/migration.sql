/*
  Warnings:

  - A unique constraint covering the columns `[otp_secret]` on the table `otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "otp_secret" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "otp_otp_secret_key" ON "otp"("otp_secret");
