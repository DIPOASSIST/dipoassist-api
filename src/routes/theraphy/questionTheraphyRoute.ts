import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import {
  createQuestionTheraphy,
  deleteQuestionTheraphy,
  getDetailQuestionTheraphy,
  getQuestionTheraphy,
  updateQuestionTheraphy,
} from '../../controllers/theraphy/questionTheraphyController';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/:id', getQuestionTheraphy);
router.get('/detail/:id', getDetailQuestionTheraphy);
router.post('/', upload.single('answer_image'), createQuestionTheraphy);
router.put('/:id', updateQuestionTheraphy);
router.delete('/:id', deleteQuestionTheraphy);

export default router;
