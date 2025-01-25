import { UUIDAdapter } from '../../../config';

export class GetBudgetByIdDto {
  private constructor(public id: string) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, GetBudgetByIdDto?] {
    const { id } = object;

    const errors: { [key: string]: string } = {};

    if (!id) errors.id = 'Missing ID';
    if (id && !UUIDAdapter.validate(id)) {
      errors.id = 'Invalid ID';
    }

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new GetBudgetByIdDto(id)];
  }
}
