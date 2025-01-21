import { Request, Response } from 'express';
import { CustomError } from "../domain";
import { Budgetservice } from "./budgets.service";

export class BudgetController {

  constructor(private budgetService: Budgetservice) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getAllBudgets = async (req: Request, res: Response) => {
    this.budgetService
      .getAllBudgets()
      .then((budgets) => res.json(budgets))
      .catch((error) => this.handleError(error, res));
  };
}
