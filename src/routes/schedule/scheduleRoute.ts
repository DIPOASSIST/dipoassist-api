import { Router } from 'express';
import {
  createSchedule,
  deleteSchedule,
  getAllScheduleByPatientId,
  getAllScheduleNakes,
  getAllSchedulePatient,
  updateSchedule,
} from '../../controllers/schedule/scheduleController';
import {
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/', nakesMiddleware, createSchedule);
router.get('/', getAllSchedulePatient);
router.get('/patient/:id', nakesMiddleware, getAllScheduleByPatientId);
router.get('/nakes', nakesMiddleware, getAllScheduleNakes);
router.put('/:id', nakesMiddleware, updateSchedule);
router.delete('/:id', nakesMiddleware, deleteSchedule);

export default router;
