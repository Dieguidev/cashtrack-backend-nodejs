import { CustomError } from '../errors/custom.error';

export class BudgetEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly amount: number
  ) {}

  static fromJson(object: { [key: string]: any }): BudgetEntity {
    const { id, name, amount } = object;

    if (!id) throw CustomError.badRequest('Missing ID');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!amount) throw CustomError.badRequest('Missing amount');

    return new BudgetEntity(id, name, amount);
  }
}
