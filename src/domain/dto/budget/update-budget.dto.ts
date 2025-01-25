import { UUIDAdapter } from '../../../config';

export class UpdateBudgetDto {
  private constructor(
    public name?: string,
    public amount?: number
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateBudgetDto?] {
    const { id, name, amount } = object;

    const errors: { [key: string]: string } = {};

    if (name && typeof name !== 'string') errors.name = 'Name must be a string';
    if (!name && !amount) {
      errors.data = 'Missing data';
    }
    if (amount && typeof amount !== 'number')
      errors.amount = 'Amount must be a number';
    if (amount <= 0) errors.amount = 'Amount must be greater than 0';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UpdateBudgetDto(name, amount)];
  }
}
