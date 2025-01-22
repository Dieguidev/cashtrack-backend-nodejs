import { Request, Response } from 'express';
import { CreaateBudgetDto, CustomError, GetBudgetByIdDto, UpdateBudgetDto } from '../../domain';
import { Budgetservice } from './budgets.service';

export class BudgetController {
  constructor(private budgetService: Budgetservice) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  createBudget = (req: Request, res: Response) => {
    const [error, creaateBudgetDto] = CreaateBudgetDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    this.budgetService
      .createBudget(creaateBudgetDto!)
      .then((budget) => res.status(201).json(budget))
      .catch((error) => this.handleError(error, res));
  };

  getAllBudgets = (req: Request, res: Response) => {
    this.budgetService
      .getAllBudgets()
      .then((budgets) => res.json(budgets))
      .catch((error) => this.handleError(error, res));
  };

  getBudgetById = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, getBudgetByIdDto] = GetBudgetByIdDto.create({ id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.budgetService
      .getBudgetById(getBudgetByIdDto!)
      .then((budget) => res.json(budget))
      .catch((error) => this.handleError(error, res));
  };

  updateBudget = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateBudgetDto] = UpdateBudgetDto.create({ ...req.body, id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.budgetService
      .updateBudget(updateBudgetDto!)
      .then((budget) => res.json(budget))
      .catch((error) => this.handleError(error, res));
  };

  deleteBudget = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, getBudgetByIdDto] = GetBudgetByIdDto.create({ id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.budgetService
      .deleteBudget(getBudgetByIdDto!)
      .then(() => res.json({ message: 'Budget deleted' }))
      .catch((error) => this.handleError(error, res));
  }

}
