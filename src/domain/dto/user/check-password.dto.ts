export class CheckPasswordDto {
  private constructor(public readonly password: string) {}
  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, CheckPasswordDto?] {
    const { password } = object;
    const errors: { [key: string]: string } = {};
    if (!password) errors.password = 'Missing password';
    if (password && typeof password !== 'string')
      errors.password = 'Password must be a string';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new CheckPasswordDto(password)];
  }
}
