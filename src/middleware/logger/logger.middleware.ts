import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const time = new Date().toISOString();

    console.log(
      `[${time}] ${req.method} ${req.originalUrl}`
    );

    next();
  }
}