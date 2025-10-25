import { Router } from 'express';
import {
  getAllLatency,
  getLatencyByDevice,
} from '../../controllers/latency/latencyController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllLatency);
router.get('/:deviceId', adminMiddleware, getLatencyByDevice);

export default router;
