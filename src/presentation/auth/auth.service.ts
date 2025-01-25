import { prisma } from '../../data/prisma/prisma-db';
import { BcryptAdapter, JwtAdapter } from '../../config';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';

type HashFunction = (password: string) => string;
type ConpareFunction = (password: string, hashed: string) => boolean;

export class AuthService {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: ConpareFunction = BcryptAdapter.compare,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password} = registerUserDto;

    const existEmail = await prisma.user.findUnique({ where: { email } })



    if (existEmail) {
      throw CustomError.badRequest('Email already exists');
    }


    try {
      const hashPassword = this.hashPassword(password);
      const user = await prisma.user.create({
        data: { email, name, password: hashPassword },
      });

      return {
        user: UserEntity.fromJson(user),
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
    const { email, password } = loginUserDto
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw CustomError.badRequest('Invalid credentials')
    }


    //ismatch ..bcrypt
    const isMatchPassword = this.comparePassword(password, user.password)
    if (!isMatchPassword) {
      throw CustomError.badRequest('Invalid credentials')
    }

    const token = await this.generateTokenService(user.id)

    return {
      user: UserEntity.fromJson(user),
      token
    }
  }


  private async generateTokenService(id: string) {
    const token = await JwtAdapter.generateToken({ id }, '128d')
    if (!token) {
      throw CustomError.internalServer('Error generating token')
    }
    return token
  }
}
