import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');
    if (!authorization) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    if (!authorization.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid Bearer token' });
      return;
    }

    const token = authorization.split(' ')[1] || '';

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: 'Invalid token - user' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) {
        res.status(401).json({ error: 'User not found  - user' });
        return;
      }

      //todo: validar si el usuario esta activo
      // if (!user.status) return res.status(401).json({ error: 'User is not active' });


      req.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });

    }
  }

  static async isAdminRole(req: Request, res: Response, next: NextFunction) {
    if (!req.body.user) {
      return res.status(500).json({
        msg: 'Se quiere verificar el role sin validar el token primero',
      });
    }
    const user = req.body.user;

    if (user.role[0] !== 'ADMIN_ROLE') {
      return res.status(401).json({
        error: 'User is not admin',
      });
    }
    next();
  }

  static async isAdminRoleOrSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.body.user) {
      return res.status(500).json({
        msg: 'Se quiere verificar el role sin validar el token primero',
      });
    }
    const user = req.body.user;

    if (user.role[0] !== 'ADMIN_ROLE' && user.id !== req.params.id) {
      return res.status(401).json({
        error: 'User is not admin or same user',
      });
    }
    next();
  }
}
