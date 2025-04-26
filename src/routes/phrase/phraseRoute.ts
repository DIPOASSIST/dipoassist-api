import { Router } from 'express';
import {
  createPhrase,
  deletePhrase,
  getAllPhrases,
  getPhraseById,
  updatePhrase,
} from '../../controllers/phrase/phraseController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllPhrases);
router.get('/:id', getPhraseById);
router.post('/', adminMiddleware, createPhrase);
router.put('/:id', adminMiddleware, updatePhrase);
router.delete('/:id', adminMiddleware, deletePhrase);

export default router;
