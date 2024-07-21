/*
  Warnings:

  - You are about to drop the column `spaceCode` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Resource` DROP COLUMN `spaceCode`,
    ADD COLUMN `space` VARCHAR(191) NULL,
    ADD COLUMN `visibility` TINYINT NOT NULL DEFAULT 0;
