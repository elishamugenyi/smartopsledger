-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "paymentBankName" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paymentAccountName" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paymentAccountNumber" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paymentSwiftCode" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "paymentOtherMethods" TEXT;
