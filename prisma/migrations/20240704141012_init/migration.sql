-- DropIndex
DROP INDEX `Post_authorId_fkey` ON `Post`;

-- AlterTable
ALTER TABLE `User` MODIFY `avatar` VARCHAR(191) NULL,
    MODIFY `fullName` VARCHAR(191) NULL;
