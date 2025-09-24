-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_medical_id_fkey` FOREIGN KEY (`medical_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
