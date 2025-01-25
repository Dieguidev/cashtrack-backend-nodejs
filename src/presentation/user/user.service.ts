import { User } from '@prisma/client';
import { CustomError, UpdateCurrentUserPasswordDto, UserEntity } from '../../domain';
import { BcryptAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';

type HashFunction = (password: string) => string;
type ConpareFunction = (password: string, hashed: string) => boolean;

export class UserService {

  constructor(
    //DI - Servicio Email
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: ConpareFunction = BcryptAdapter.compare,
  ) { }
  async getUserByJWT(user: User) {
    return UserEntity.fromJson(user);
  }

  async updateCurrentUserPassword(UpdateCurrentUserPasswordDto: UpdateCurrentUserPasswordDto, user: User) {
    const { currentPassword, password } = UpdateCurrentUserPasswordDto;

    try {


      const isMatchPassword = this.comparePassword(currentPassword, user!.password)
      if (!isMatchPassword) {
        throw CustomError.unauthorized('Current password does not match')
      }

      await prisma.user.update({
        where: {
          id: user!.id
        },
        data: {
          password: this.hashPassword(password)
        }
      })

      return 'Password updated successfully'
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
