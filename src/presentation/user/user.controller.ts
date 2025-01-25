import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getUserByJWT = (req: Request, res: Response) => {
    // res.json(req.user);
    this.userService
        .getUserByJWT(req.user!)
        .then((user) => res.json(user))
        .catch((error) => this.handleError(error, res));
  };
}
