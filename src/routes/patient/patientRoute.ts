import { Router } from 'express';
import {
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';
import { deletePatientMedical } from '../../controllers/patient/patientController';

const router = Router();

router.use(authMiddleware);
router.patch('/:id/remove-medical', nakesMiddleware, deletePatientMedical);

export default router;
