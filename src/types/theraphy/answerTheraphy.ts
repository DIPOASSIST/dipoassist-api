import { AnswerQuestionTheraphyType } from '../../validator/theraphy/answerQuestionTheraphyValidator';

export interface CreateAnswerTheraphyProps extends AnswerQuestionTheraphyType {
  answer_image?: Express.Multer.File;
}

export interface UpdateAnswerTheraphyProps extends AnswerQuestionTheraphyType {
  answer_image?: Express.Multer.File;
}
