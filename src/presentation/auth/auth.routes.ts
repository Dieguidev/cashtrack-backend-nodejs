import { Router } from 'express';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../email/email.service';
import { envs, limiter } from '../../config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(
      envs.mailerService,
      envs.mailerEmail,
      envs.mailerSecretKey,
      envs.sendEmail
    );
    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);

    router.use(limiter);

    router.post('/register', controller.registerUser);
    router.post('/login', controller.loginUser);
    router.post('/confirm-account', controller.confirmAccount);
    router.post('/forgot-password', controller.forgotPassword);

    return router;
  }
}
