import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';
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
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }

    if (!UUIDAdapter.validate(id)) {
      res.status(400).json({ error: 'Invalid Id' });
      return;
    }
    try {
      const budget = await prisma.budget.findUnique({
        where: {
          id,
        },
      });

      if (!budget) {
        res.status(404).json({ error: 'Budget not found' });
        return;
      }

      req.budget = budget;
      console.log(req.budget);

      next();
    } catch (error) {
      console.log(error);
      res.status(200).json({ error: 'Internal server error' });
      return;
    }
  };
}
