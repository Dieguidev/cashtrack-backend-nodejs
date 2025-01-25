import { Expense } from '@prisma/client';
import { CustomError } from '../errors/custom.error';
import { ExpenseEntity } from './expense.entity';

export class BudgetEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly expenses: Expense[] = []
  ) {}

  static fromJson(object:  { [key: string]: any } ): BudgetEntity {
    const { id, name, amount, expenses } = object;

    if (!id) throw CustomError.badRequest('Missing ID');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!amount) throw CustomError.badRequest('Missing amount');

    const expensesFromJson = expenses
      ? expenses.map((expense: Expense) => ExpenseEntity.fromJson(expense))
      : expenses;

    return new BudgetEntity(id, name, amount, expensesFromJson);
  }
}
