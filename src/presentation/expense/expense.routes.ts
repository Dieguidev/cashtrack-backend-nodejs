import { Router } from 'express';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { BudgetMiddleware } from '../middlewares/budget.middleware';

export class ExpenseRoutes {
  static get router(): Router {
    const router = Router();

    const expenseService = new ExpenseService();
    const controller = new ExpenseController(expenseService);

    router.param('budgetId', BudgetMiddleware.budgetExists);

    router.post('/budget/:budgetId', controller.createExpense);

    return router;
  }
}
