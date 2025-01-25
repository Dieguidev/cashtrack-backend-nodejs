export class ValidateTokenFromResetPasswordDto {
  private constructor(
    public token: string,
  ) { }

  static create(object: { [key: string]: any }): [string?, ValidateTokenFromResetPasswordDto?] {
    const { token } = object;

    if (!token) return ['Missing token'];
    if (token.length !== 6) return ['Invalid token'];

    return [undefined, new ValidateTokenFromResetPasswordDto(token)];
  }
}
