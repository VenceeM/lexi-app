-- CreateTable
CREATE TABLE "InvalidTokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "expirationTime" TEXT NOT NULL,

    CONSTRAINT "InvalidTokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvalidTokens" ADD CONSTRAINT "InvalidTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
