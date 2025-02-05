import { UUIDAdapter, Validators } from '../../../config';

export class UpdateUserDto {
  private constructor(
    public name?: string,
    public email?: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateUserDto?] {
    const { name, email } = object;

    const errors: { [key: string]: string } = {};

    if (!name && !email) {
      errors.data = 'Missing data';
    }
    if (name && typeof name !== 'string') errors.name = 'Name must be a string';
    if (email && !Validators.email.test(email))
      errors.email = 'Email must be a valid email';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UpdateUserDto(name, email)];
  }
}
