import * as userController from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login)

export default router;