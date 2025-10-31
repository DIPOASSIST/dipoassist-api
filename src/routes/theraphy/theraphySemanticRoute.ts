import { Router } from 'express';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';
import {
  createTheraphySemantic,
  deleteTheraphySemanticById,
  getAllTheraphySemantic,
  getTheraphySemanticById,
  updateTheraphySemanticById,
} from '../../controllers/theraphy/theraphySemanticController';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllTheraphySemantic);
router.get('/:id', getTheraphySemanticById);
router.post('/', adminMiddleware, createTheraphySemantic);
router.put('/:id', adminMiddleware, updateTheraphySemanticById);
router.delete('/:id', adminMiddleware, deleteTheraphySemanticById);

export default router;
