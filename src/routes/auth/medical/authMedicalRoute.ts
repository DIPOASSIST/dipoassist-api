import { Router } from 'express';
import {
  loginMedical,
  registerMedical,
} from '../../../controllers/auth/medical/authMedicalController';

const router = Router();

router.post('/register/admin', registerMedical);
router.post('/login/admin', loginMedical);

export default router;
