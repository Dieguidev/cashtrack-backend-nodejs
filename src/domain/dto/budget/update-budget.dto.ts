import { UUIDAdapter } from '../../../config';

export class GetBudgetByIdDto {
  private constructor(
    public id: string,
    public name?: string,
    public amount?: number
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, GetBudgetByIdDto?] {
    const { id, name, amount } = object;

    const errors: { [key: string]: string } = {};

    if (!id) errors.id = 'Missing ID';
    if (id && !UUIDAdapter.validate(id)) {
      errors.id = 'Invalid ID';
    }
    if (name && typeof name !== 'string') errors.name = 'Name must be a string';
    if (!name && !amount) {
      errors.data = 'Missing data';
    }
    if (amount && typeof amount !== 'number')
      errors.amount = 'Amount must be a number';
    if (amount && amount <= 0) errors.amount = 'Amount must be greater than 0';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new GetBudgetByIdDto(id, name, amount)];
  }
}
