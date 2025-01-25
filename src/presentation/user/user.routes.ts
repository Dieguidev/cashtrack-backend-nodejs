import { Router } from 'express';
import { limiter } from '../../config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const userService = new UserService();
    const controller = new UserController(userService);

    router.use(limiter);

    router.get(
      '/get-user-login',
      [AuthMiddleware.validateJWT],
      controller.getUserByJWT
    );

    router.post('/update-password', [AuthMiddleware.validateJWT], controller.updateCurrentUserPassword)

    return router;
  }
}
