import * as authController from '../controllers/auth.controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgottPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/getMe', authController.getMe);
router.post('/updateMyPassword', authController.updateMyPassword);
router.post('/updateMe', authController.updateMe);

router.post('/verfyingEmailRequest', authController.verifyingEmailRequest);
router.post('/verfyingEmail/:token', authController.verifyEmailCode);

export default router;