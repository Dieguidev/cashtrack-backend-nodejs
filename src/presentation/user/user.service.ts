import { User } from '@prisma/client';
import {
  CheckPasswordDto,
  CustomError,
  UpdateCurrentUserPasswordDto,
  UpdateUserDto,
  UserEntity,
} from '../../domain';
import { BcryptAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';

type HashFunction = (password: string) => string;
type ConpareFunction = (password: string, hashed: string) => boolean;

export class UserService {
  constructor(
    //DI - Servicio Email
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: ConpareFunction = BcryptAdapter.compare
  ) {}
  async getUserByJWT(user: User) {
    return UserEntity.fromJson(user);
  }

  async updateCurrentUserPassword(
    UpdateCurrentUserPasswordDto: UpdateCurrentUserPasswordDto,
    user: User
  ) {
    const { currentPassword, password } = UpdateCurrentUserPasswordDto;

    try {
      const isMatchPassword = this.comparePassword(
        currentPassword,
        user!.password
      );
      if (!isMatchPassword) {
        throw CustomError.unauthorized('Current password does not match');
      }

      await prisma.user.update({
        where: {
          id: user!.id,
        },
        data: {
          password: this.hashPassword(password),
        },
      });

      return 'Password updated successfully';
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  public async checkPassword(checkPasswordDto: CheckPasswordDto, user: User) {
    const { password } = checkPasswordDto;

    try {
      const isMatchPassword = this.comparePassword(password, user!.password);
      if (!isMatchPassword) {
        throw CustomError.unauthorized('Current password does not match');
      }

      return 'Password match';
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  public async updateUser(updateUserDto: UpdateUserDto, userId: User['id']) {
    const { name, email } = updateUserDto;
    const existsEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existsEmail && existsEmail.id !== userId) {
      throw CustomError.conflict('Email already exists');
    }

    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateUserDto,
      });

      return 'User updated successfully';
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
