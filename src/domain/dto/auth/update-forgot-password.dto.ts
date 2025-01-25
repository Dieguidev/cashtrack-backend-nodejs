export class UpdateForgotPssword {
  private constructor(
    public password: string,
    public passwordConfirmation: string,
    public token: string,
  ) { }

  static create(object: { [key: string]: any }): [{ [key: string]: string }?, UpdateForgotPssword?]{
    const { password, passwordConfirmation, token } = object;

    const errors: { [key: string]: string } = {};

    if (!password) errors.password = 'Missing password';
    if (typeof password !== 'string') errors.password = 'Invalid password - must be a string';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!passwordConfirmation) errors.passwordConfirmation = 'Missing password confirmation';
    if (passwordConfirmation !== password) errors.noMatch = 'Passwords do not match';
    if (!token) errors.token = 'Missing token';
    if (token.length !== 6) errors.token = 'Invalid token';
    if (typeof token !== 'string') errors.token = 'Invalid token - must be a string';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UpdateForgotPssword(password, passwordConfirmation, token)];
  }
}
