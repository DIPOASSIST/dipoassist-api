/*
  Warnings:

  - A unique constraint covering the columns `[device_token]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_token` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` ADD COLUMN `device_token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `devices_device_token_key` ON `devices`(`device_token`);
