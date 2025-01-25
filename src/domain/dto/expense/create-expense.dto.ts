export class CreateExpenseDto {
  private constructor(public name: string, public amount: number) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreateExpenseDto?] {
    const { name, amount } = object;

    const errors: { [key: string]: string } = {};

    if (!name) errors.name = 'Missing name';
    if (name && typeof name !== 'string') errors.name = 'Name must be a string';
    if (!amount) errors.amount = 'Missing amount';
    if (typeof amount !== 'number') errors.amount = 'Amount must be a number';
    if (amount <= 0) errors.amount = 'Amount must be greater than 0';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new CreateExpenseDto(name, amount)];
  }
}
