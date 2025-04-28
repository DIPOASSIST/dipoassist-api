import { Router } from 'express';
import {
  loginMedical,
  registerMedical,
} from '../../../controllers/auth/medical/authMedicalController';

const router = Router();

router.post('/register/medical', registerMedical);
router.post('/login/medical', loginMedical);

export default router;
