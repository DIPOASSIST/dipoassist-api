/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_personal` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `nakes_id` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'NAKES', 'USER') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `admins`;

-- DropTable
DROP TABLE `medical_personal`;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_nakes_id_fkey` FOREIGN KEY (`nakes_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
