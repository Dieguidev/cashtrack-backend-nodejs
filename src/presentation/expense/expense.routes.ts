import { Router } from 'express';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';

export class ExpenseRoutes {
  static get router(): Router {
    const router = Router();

    const expenseService = new ExpenseService();
    const controller = new ExpenseController(expenseService);



    return router;
  }
}
