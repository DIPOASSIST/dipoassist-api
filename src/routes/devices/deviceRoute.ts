import { Router } from 'express';
import {
  createDevice,
  deleteDevice,
  getAllDevice,
  getDetailDevice,
  regenerateDeviceToken,
  updateDevice,
} from '../../controllers/devices/deviceController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllDevice);
router.get('/:id', getDetailDevice);
router.post('/', adminMiddleware, createDevice);
router.patch('/:id/regenerate', adminMiddleware, regenerateDeviceToken);
router.put('/:id', adminMiddleware, updateDevice);
router.delete('/:id', adminMiddleware, deleteDevice);

export default router;
