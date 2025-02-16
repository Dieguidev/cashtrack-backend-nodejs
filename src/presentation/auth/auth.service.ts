import { prisma } from '../../data/prisma/prisma-db';
import { BcryptAdapter, JwtAdapter } from '../../config';
import {
  ConfirmSixDigitCodeDto,
  CustomError,
  ForgotPasswordDto,
  IEmail,
  LoginUserDto,
  RegisterUserDto,
  UpdateForgotPsswordDto,
  ValidateTokenFromResetPasswordDto,
} from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailService } from '../email/email.service';

type HashFunction = (password: string) => string;
type ConpareFunction = (password: string, hashed: string) => boolean;

export class AuthService {
  constructor(
    private readonly emailservice: EmailService,
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: ConpareFunction = BcryptAdapter.compare
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    const existEmail = await prisma.user.findUnique({ where: { email } });

    if (existEmail) {
      throw CustomError.badRequest('Email already exists');
    }

    try {
      const result = await prisma.$transaction(async (prisma) => {
        const hashPassword = this.hashPassword(password);
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashPassword,
            token: this.generateSixDigitCode(),
          },
        });

        await this.sendEmailValidationSixdigitToken({
          email: user.email,
          name: user.name,
          token: user.token!,
        });

        return user;
      });
      return {
        user: UserEntity.fromJson(result),
        // user: userEntity,
        // token
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw CustomError.unauthorized('Invalid credentials');
    }

    const isMatchPassword = this.comparePassword(password, user.password);
    if (!isMatchPassword) {
      throw CustomError.unauthorized('Invalid credentials');
    }

    if (!user.confirmed) {
      throw CustomError.forbidden('Account not confirmed');
    }

    const token = await this.generateJWTService(user.id);

    return {
      user: UserEntity.fromJson(user),
      token,
    };
  }

  public async confirmSixDigitToken(
    confirmSixDigitCodeDto: ConfirmSixDigitCodeDto
  ) {
    try {
      const sixDigitTokenExists = await prisma.user.findFirst({
        where: {
          token: confirmSixDigitCodeDto.token,
        },
      });

      if (!sixDigitTokenExists) {
        throw CustomError.badRequest('Invalid token');
      }

      const user = await prisma.user.update({
        where: {
          id: sixDigitTokenExists.id,
        },
        data: {
          confirmed: true,
          token: null,
        },
      });

      return UserEntity.fromJson(user);
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    try {
      const existUser = await prisma.user.findUnique({ where: { email } });
      if (!existUser) {
        throw CustomError.badRequest('User not exist');
      }

      const result = await prisma.$transaction(async (prisma) => {
        const code = this.generateSixDigitCode();
        const updateUser = await prisma.user.update({
          where: {
            id: existUser.id,
          },
          data: {
            token: code,
          },
        });

        await this.sendEmaiForgotPassword({
          email: existUser.email,
          name: existUser.name,
          token: code,
        });
        return updateUser;
      });
      return {
        user: UserEntity.fromJson(result),
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  public async validateTokenFromResetPassword(
    validateTokenFromResetPasswordDto: ValidateTokenFromResetPasswordDto
  ) {
    const { token } = validateTokenFromResetPasswordDto;
    try {
      const user = await prisma.user.findFirst({
        where: {
          token,
        },
      });
      if (!user) {
        throw CustomError.badRequest('Invalid token');
      }

      return 'Token is valid';
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateForgotPasswordWithToken(
    updateForgotPssword: UpdateForgotPsswordDto
  ) {
    const { token, password } = updateForgotPssword;

    try {
      const user = await prisma.user.findFirst({
        where: {
          token,
        },
      });

      if (!user) {
        throw CustomError.badRequest('Invalid token');
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: this.hashPassword(password),
          token: null,
        },
      });

      return 'Password updated';
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  }

  private async sendEmaiForgotPassword(user: IEmail) {
    const html = `
      <h1>Valida tu email</h1>
      <p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
      <p>Visita el siguiente enlace:</p>
      <p>Ingresa el código: <b>${user.token}</b></p>
      <p>Exte token expira en 10 minutos</p>
      `;
    // <a href="${envs.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>

    const options = {
      to: user.email,
      subject: 'Restablece tu password',
      html,
    };

    try {
      const isSent = await this.emailservice.sendEmail(options);
      if (!isSent) {
        throw new Error('Error sending email');
      }
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer('Error sending email');
    }
  }

  private async generateJWTService(id: string) {
    const token = await JwtAdapter.generateToken({ id }, '128d');
    if (!token) {
      throw CustomError.internalServer('Error generating token');
    }
    return token;
  }

  private generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  private async sendEmailValidationSixdigitToken(user: IEmail) {
    const html = `
      <h1>Valida tu email</h1>
      <p>Hola: ${user.name}, has creado tu cuenta, ya casi esta todo listo, solo debes confirmar tu cuenta </p>
      <p>Visita el siguiente enlace:</p>
      <p>Ingresa el código: <b>${user.token}</b></p>
      <p>Exte token expira en 10 minutos</p>
      `;
    // <a href="${envs.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>

    const options = {
      to: user.email,
      subject: 'Confirma tu cuenta',
      html,
    };

    try {
      const isSent = await this.emailservice.sendEmail(options);
      if (!isSent) {
        throw new Error('Error sending email');
      }
    } catch (error: any) {
      console.log(error);
      throw CustomError.internalServer('Error sending email 1');
    }
  }
}
