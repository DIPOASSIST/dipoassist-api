import { QuestionTheraphyType } from '../../validator/theraphy/questionTheraphyValidator';

export interface CreateQuestionTheraphyProps extends QuestionTheraphyType {
  answer_image?: Express.Multer.File;
}

export interface UpdateQuestionTheraphyProps extends QuestionTheraphyType {
  answer_image?: Express.Multer.File;
}
