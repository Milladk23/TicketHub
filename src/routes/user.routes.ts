import * as authController from '../controllers/auth.controllers';
import * as userController from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgottPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/getMe', authController.getMe);
router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', authController.updateMe);

router.post('/verfyingEmailRequest', authController.verifyingEmailRequest);
router.post('/verfyingEmail/:token', authController.verifyEmailCode);

router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.creatUser);
router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);

router.patch('/promotingToAgent/:id', userController.promotingToAgent); 

export default router;