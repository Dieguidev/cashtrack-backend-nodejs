
import { Validators } from '../../../config';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, RegisterUserDto?] {
    const { name, email, password, passwordConfirmation } = object;

    const errors: { [key: string]: string } = {};

    if (!name) errors.name = 'Missing name';
    if (name && typeof name !== 'string') errors.name = 'Invalid name - must be a string';
    if (!email) errors.email = 'Missing email';
    if (email && !Validators.email.test(email)) errors.email = 'Invalid email';
    if (!password) errors.password = 'Missing password';
    if (password && typeof password !== 'string') errors.password = 'Invalid password - must be a string';
    if (password && password.length < 8)
      errors.password = 'Password must be at least 6 characters';
    if (!passwordConfirmation)
      errors.passwordConfirmation = 'Missing password confirmation';
    if (password && passwordConfirmation && password !== passwordConfirmation)
      errors.noMatch = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }


    return [
      undefined,
      new RegisterUserDto(
        name,
        email.toLowerCase(),
        password
      ),
    ];
  }
}
