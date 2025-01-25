import { Router } from "express";
import { BudgetRoutes } from "./budget/budget.routes";
import { ExpenseRoutes } from "./expense/expense.routes";
import { AuthRoutes } from "./auth/auth.routes";
import { UserRoutes } from "./user/user.routes";

export class AppRoutes {
  static get routes():Router {
    const router = Router();

    router.use('/auth', AuthRoutes.routes)
    router.use('/budget', BudgetRoutes.router)
    router.use('/expense', ExpenseRoutes.router)
    router.use('/user', UserRoutes.routes)

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
