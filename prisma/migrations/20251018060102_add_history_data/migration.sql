/*
  Warnings:

  - You are about to drop the `article_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_type_id_fkey`;

-- DropTable
DROP TABLE `article_types`;

-- DropTable
DROP TABLE `articles`;

-- CreateTable
CREATE TABLE `History` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `predicted_label` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
