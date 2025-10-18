import { Router } from 'express';
import {
  createDevice,
  deleteDevice,
  getAllDevice,
  getAllDeviceByNakes,
  getAllDeviceByUser,
  getAllDeviceByUserId,
  getDetailDevice,
  regenerateDeviceToken,
  updateDevice,
} from '../../controllers/devices/deviceController';
import {
  adminMiddleware,
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllDevice);
router.get('/user/:userId', getAllDeviceByUserId);
router.get('/nakes', nakesMiddleware, getAllDeviceByNakes);
router.get('/user', getAllDeviceByUser);
router.get('/:id', getDetailDevice);
router.post('/', adminMiddleware, createDevice);
router.patch('/:id/regenerate', adminMiddleware, regenerateDeviceToken);
router.put('/:id', adminMiddleware, updateDevice);
router.delete('/:id', adminMiddleware, deleteDevice);

export default router;
