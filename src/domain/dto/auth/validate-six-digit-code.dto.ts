export class ConfirmSixDigitCodeDto {
  private constructor(
    public token: string,
  ) { }

  static create(object: { [key: string]: any }): [string?, ConfirmSixDigitCodeDto?] {
    const { token } = object;

    if (!token) return ['Missing token'];
    if (token.length !== 6) return ['Invalid token'];

    return [undefined, new ConfirmSixDigitCodeDto(token)];
  }
}
