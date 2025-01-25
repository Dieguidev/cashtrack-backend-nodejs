import { User } from "@prisma/client";
import { UserEntity } from "../../domain/entities/user.entity";

export class UserService {
  async getUserByJWT(user:User) {
    return UserEntity.fromJson(user);
  }
}

