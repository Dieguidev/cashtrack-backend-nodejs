export class CreaateBudgetDto {
  private constructor(public name: string, public amount: number) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CreaateBudgetDto?] {
    const { name, amount } = object;

    const errors: { [key: string]: string } = {};

    if (!name) errors.name = 'Missing name';
    if (!amount) errors.amount = 'Missing amount';
    if (typeof amount !== 'number') errors.amount = 'Amount must be a number';
    if (amount <= 0) errors.amount = 'Amount must be greater than 0';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new CreaateBudgetDto(name, amount)];
  }
}
