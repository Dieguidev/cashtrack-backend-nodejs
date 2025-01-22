import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction){
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }
  next();
}
