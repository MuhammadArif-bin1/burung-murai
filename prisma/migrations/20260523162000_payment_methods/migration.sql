-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BANK', 'EWALLET');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN "paymentType" "PaymentType";
ALTER TABLE "payments" ADD COLUMN "paymentLabel" TEXT;
ALTER TABLE "payments" ADD COLUMN "accountNumber" TEXT;
ALTER TABLE "payments" ADD COLUMN "proofImageUrl" TEXT;
