import { Request, Response } from 'express';
import { ConfirmSixDigitCodeDto, CustomError, ForgotPasswordDto, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authService
      .registerUser(registerUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authService
      .loginUser(loginUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  confirmAccount = (req: Request, res: Response) => {
    const [error, confirmSixDigitCodeDto] = ConfirmSixDigitCodeDto.create(req.body)
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.authService.confirmSixDigitToken(confirmSixDigitCodeDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  }

  forgotPassword = (req: Request, res: Response) => {
    const [error, forgotPasswordDto] = ForgotPasswordDto.create(req.body)
    if (error) {
      res.status(400).json({ error })
      return
    }

    this.authService.forgotPassword(forgotPasswordDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  }
}
