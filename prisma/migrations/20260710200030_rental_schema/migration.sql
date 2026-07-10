/*
  Warnings:

  - You are about to drop the column `statDate` on the `rental_requests` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `rental_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_requests" DROP COLUMN "statDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
