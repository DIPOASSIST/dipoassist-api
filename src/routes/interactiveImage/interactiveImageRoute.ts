import { Router } from 'express';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';
import {
  createInteractiveImage,
  deleteInteractiveImage,
  getAllInteractiveImages,
  getDetailInteractiveImage,
  updateInteractiveImage,
} from '../../controllers/interactiveImage/interactiveImageController';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllInteractiveImages);
router.get('/:id', getDetailInteractiveImage);
router.post(
  '/',
  adminMiddleware,
  upload.single('image_url'),
  createInteractiveImage,
);
router.put(
  '/:id',
  adminMiddleware,
  upload.single('image_url'),
  updateInteractiveImage,
);
router.delete('/:id', adminMiddleware, deleteInteractiveImage);

export default router;
