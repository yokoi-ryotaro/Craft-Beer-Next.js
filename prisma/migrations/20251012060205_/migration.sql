/*
  Warnings:

  - Made the column `stock` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Item" ALTER COLUMN "stock" SET NOT NULL;
