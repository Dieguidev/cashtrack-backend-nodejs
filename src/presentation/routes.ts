import { Router } from "express";
import { BudgetRoutes } from "./budget/budget.routes";
import { ExpenseRoutes } from "./expense/expense.routes";
import { AuthRoutes } from "./auth/auth.routes";

export class AppRoutes {
  static get routes():Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes)
    // router.use('/api/user', UserRoutes.routes)
    router.use('/budget', BudgetRoutes.router)
    router.use('/expense', ExpenseRoutes.router)

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })

    const apiRouter = Router();
    apiRouter.use('/api', router)

    return apiRouter;
  }
}
