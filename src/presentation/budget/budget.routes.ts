import { Router } from 'express';
import { Budgetservice } from './budgets.service';
import { BudgetController } from './budget.controller';
import { BudgetMiddleware } from '../middlewares/budget.middleware';

export class BudgetRoutes {
  static get router(): Router {
    const router = Router();

    const budgetService = new Budgetservice();
    const controller = new BudgetController(budgetService);

    router.param('budgetId', BudgetMiddleware.budgetExists);

    router.post('/', controller.createBudget);
    router.get('/', controller.getAllBudgets);
    router.get('/:budgetId', controller.getBudgetById);
    router.put('/:budgetId', controller.updateBudget);
    router.delete('/:budgetId', controller.deleteBudget);
    return router;
  }
}
