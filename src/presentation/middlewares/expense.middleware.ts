import { Request, Response, NextFunction } from 'express';
import { UUIDAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';
import { Budget, Expense } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export class ExpenseMiddleware {
  static expenseExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { expenseId, budgetId } = req.params;
    if (!expenseId) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }

    if (!UUIDAdapter.validate(expenseId)) {
      res.status(400).json({ error: 'Invalid Id' });
      return;
    }
    try {
      const expense = await prisma.expense.findUnique({
        where: {
          id: expenseId,
        },
      });

      if (!expense) {
        res.status(404).json({ error: 'Expense not found' });
        return;
      }
      if (expense.budgetId !== budgetId) {
        res.status(403).json({ error: 'Expense does not belong to the budget' });
        return;
      }

      req.expense = expense;

      next();
    } catch (error) {
      console.log(error);
      res.status(200).json({ error: 'Internal server error' });
      return;
    }
  };
}
