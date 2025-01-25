import { Request, Response } from 'express';
import { CreateExpenseDto, CustomError, UpdateExpenseDto } from '../../domain';
import { ExpenseService } from './expense.service';

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  createExpense = (req: Request, res: Response) => {
    const [error, createExpenseDto] = CreateExpenseDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.expenseService
      .createExpense(req.budget?.id!, createExpenseDto!)
      .then((expense) => res.status(201).json(expense))
      .catch((error) => this.handleError(error, res));
  };

  getById = (req: Request, res: Response) => {
    this.expenseService
      .getExpenseByid(req.expense!)
      .then((expense) => res.json(expense))
      .catch((error) => this.handleError(error, res));
  }

  updateExpense = (req: Request, res: Response) => {
    const [error, updateExpenseDto] = UpdateExpenseDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.expenseService
      .updateExpense(req.expense!.id, updateExpenseDto!)
      .then((expense) => res.json(expense))
      .catch((error) => this.handleError(error, res));
  }
}
