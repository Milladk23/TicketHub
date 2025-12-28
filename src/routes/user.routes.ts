import * as userController from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login)

router.use(userController.protect);

router.get('/getMe', userController.getMe);
router.post('/updateMyPassword', userController.updateMyPassword);
router.post('/updateMe', userController.updateMe);

router.post('/verfyingEmailRequest', userController.verifyingEmailRequest);
router.post('/verfyingEmail/:token', userController.verifyEmailCode);

export default router;