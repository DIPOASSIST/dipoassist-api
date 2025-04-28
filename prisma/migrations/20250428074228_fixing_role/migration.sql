-- AlterTable
ALTER TABLE `admins` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `medical_personal` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'medical_personal';
