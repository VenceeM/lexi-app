-- AlterTable
ALTER TABLE "users" ADD COLUMN     "google_id" INTEGER,
ALTER COLUMN "password" DROP NOT NULL;
