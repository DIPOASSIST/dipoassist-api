import { Router } from 'express';
import {
  createDevice,
  deleteDevice,
  getAllDevice,
  getDetailDevice,
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
router.put('/:id', adminMiddleware, updateDevice);
router.delete('/:id', adminMiddleware, deleteDevice);

export default router;
