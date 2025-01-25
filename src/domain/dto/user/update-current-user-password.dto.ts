export class UpdateCurrentUserPasswordDto {
  private constructor(
    public currentPassword: string,
    public password: string,
  ) { }

  static create(object: { [key: string]: any }): [{ [key: string]: string }?, UpdateCurrentUserPasswordDto?] {
    const { currentPassword, password, passwordConfirmation } = object;

    const errors: { [key: string]: string } = {};

    if (!currentPassword) errors.currentPassword = 'Missing current password';
    if(currentPassword && typeof currentPassword !== 'string') errors.currentPassword = 'Current password must be a string';
    if (!password) errors.password = 'Missing password';
    if(password && typeof password !== 'string') errors.password = 'Password must be a string';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters long';
    if (!passwordConfirmation) errors.passwordConfirmation = 'Missing password confirmation';
    if (password !== passwordConfirmation)  errors.noMatch = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UpdateCurrentUserPasswordDto(currentPassword, password)];
  }
}
