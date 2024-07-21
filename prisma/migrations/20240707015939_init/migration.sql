/*
  Warnings:

  - You are about to drop the column `shareSpaceCodes` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Resource` DROP COLUMN `shareSpaceCodes`,
    ADD COLUMN `ownerId` INTEGER NOT NULL,
    ADD COLUMN `shareSpaces` VARCHAR(191) NULL;
