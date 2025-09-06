-- AddForeignKey
ALTER TABLE `phrases_urgency` ADD CONSTRAINT `phrases_urgency_phrase_id_fkey` FOREIGN KEY (`phrase_id`) REFERENCES `phrases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
