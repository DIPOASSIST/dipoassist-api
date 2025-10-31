import { Router } from 'express';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';
import {
  createAnswerTheraphy,
  getAnswerTheraphy,
} from '../../controllers/theraphy/answerTheraphyController';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/:questionId', getAnswerTheraphy);
router.post(
  '/',
  adminMiddleware,
  upload.single('answer_image'),
  createAnswerTheraphy,
);

export default router;
