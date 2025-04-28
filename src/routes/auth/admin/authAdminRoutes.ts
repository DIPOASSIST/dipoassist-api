import { Router } from 'express';
import {
  loginAdmin,
  registerAdmin,
} from '../../../controllers/auth/admin/authAdminController';

const router = Router();

router.post('/register/admin', registerAdmin);
router.post('/login/admin', loginAdmin);

export default router;
