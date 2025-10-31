/*
  Warnings:

  - A unique constraint covering the columns `[question_id]` on the table `answer_theraphies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `answer_theraphies_question_id_key` ON `answer_theraphies`(`question_id`);
