import * as userController from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', userController.signup);

export default router;