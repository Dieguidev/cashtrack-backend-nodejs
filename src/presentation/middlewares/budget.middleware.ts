import { Request, Response, NextFunction } from 'express';
import { UUIDAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';
import { Budget } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export class BudgetMiddleware {
  static budgetExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { budgetId } = req.params;
    if (!budgetId) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }

    if (!UUIDAdapter.validate(budgetId)) {
      res.status(400).json({ error: 'Invalid Id' });
      return;
    }
    try {
      const budget = await prisma.budget.findUnique({
        where: {
          id: budgetId,
        },
        include: {
          expenses: true,
        },
      });

      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      req.budget = budget;

      next();
    } catch (error) {
      console.log(error);
      res.status(200).json({ error: 'Internal server error' });
      return;
    }
  };

  static budegtBelongsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { budget, user } = req;
    if (budget?.userId !== user?.id) {
      res
        .status(401)
        .json({ error: 'You are not authorized to access this resource' });
      return;
    }
    next();
  };
}
