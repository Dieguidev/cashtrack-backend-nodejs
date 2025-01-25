import { Budget } from '@prisma/client';
import { CustomError } from '../errors/custom.error';
import { BudgetEntity } from './budget.entity';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly confirmed: boolean,
    public readonly budgets: Budget[] = [],
    public readonly token?: string
  ) {}

  static fromJson(object: { [key: string]: any }): UserEntity {
    const { id, name, email, confirmed, budgets, token } = object;

    if (!id) throw CustomError.badRequest('Missing ID');
    if (!name) throw CustomError.badRequest('Missing name');
    if(!email) throw CustomError.badRequest('Missing email');
    if (!confirmed) throw CustomError.badRequest('Missing confirmed');

    const budgetsFromJson = budgets
      ? budgets.map((budget: Budget) => BudgetEntity.fromJson(budget))
      : budgets;


    return new UserEntity(id, name, email, confirmed, budgetsFromJson, token);
  }
}
