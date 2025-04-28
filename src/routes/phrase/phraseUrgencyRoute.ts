import { Router } from 'express';
import {
  createPhraseUrgency,
  deletePhraseUrgency,
  getAllPhraseUrgency,
  getPhraseUrgencyById,
  updatePhraseUrgency,
} from '../../controllers/phrase/phraseUrgencyController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllPhraseUrgency);
router.get('/:id', getPhraseUrgencyById);
router.post('/', createPhraseUrgency);
router.put('/:id', updatePhraseUrgency);
router.delete('/:id', deletePhraseUrgency);

export default router;
