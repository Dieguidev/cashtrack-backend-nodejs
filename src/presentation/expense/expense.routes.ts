import { Router } from 'express';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { BudgetMiddleware } from '../middlewares/budget.middleware';
import { ExpenseMiddleware } from '../middlewares/expense.middleware';

export class ExpenseRoutes {
  static get router(): Router {
    const router = Router();

    const expenseService = new ExpenseService();
    const controller = new ExpenseController(expenseService);

    router.param('budgetId', BudgetMiddleware.budgetExists);
    router.param('expenseId', ExpenseMiddleware.expenseExists);

    router.post('/budget/:budgetId', controller.createExpense);
    router.get('/:expenseId/budget/:budgetId', controller.getById);
    router.patch('/:expenseId/budget/:budgetId', controller.updateExpense);
    router.delete('/:expenseId/budget/:budgetId', controller.deleteExpense);

    return router;
  }
}
