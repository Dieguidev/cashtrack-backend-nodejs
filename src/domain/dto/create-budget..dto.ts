
export class CreateBudgetDto {

  private constructor(
    public email: string,
    public password: string,
  ) { }

  static create(object: { [key: string]: any }): [string?, CreateBudgetDto?] {
    const { email, password } = object;

    if (!email) return ['Missing email'];
    if(!Validators.email.test(email)) return ['Invalid email'];
    if (!password) return ['Missing password'];


    return [undefined, new CreateBudgetDto( email.toLowerCase(), password)];

  }
}
