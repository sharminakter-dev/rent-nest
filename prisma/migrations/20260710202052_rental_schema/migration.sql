/*
  Warnings:

  - You are about to drop the column `landlordId` on the `rental_requests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rental_requests" DROP CONSTRAINT "rental_requests_landlordId_fkey";

-- AlterTable
ALTER TABLE "rental_requests" DROP COLUMN "landlordId";
