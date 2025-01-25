import { Router } from 'express';
import { Budgetservice } from './budgets.service';
import { BudgetController } from './budget.controller';
import { BudgetMiddleware } from '../middlewares/budget.middleware';

export class BudgetRoutes {
  static get router(): Router {
    const router = Router();

    const budgetService = new Budgetservice();
    const controller = new BudgetController(budgetService);

    router.post('/', controller.createBudget);
    router.get('/', controller.getAllBudgets);
    router.get(
      '/:id',
      [BudgetMiddleware.budgetExists],
      controller.getBudgetById
    );
    router.put(
      '/:id',
      [BudgetMiddleware.budgetExists],
      controller.updateBudget
    );
    router.delete(
      '/:id',
      [BudgetMiddleware.budgetExists],
      controller.deleteBudget
    );
    return router;
  }
}
