import { Router } from 'express';
import { getAllDeviceLogByDevice } from '../../controllers/devices/deviceLogController';

const router = Router();

router.get('/:deviceId/logs', getAllDeviceLogByDevice);

export default router;
