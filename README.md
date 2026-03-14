## Middleware

```bash
# create middleware
$ nest g middleware middleware/logger
```

![](/public/Img/middlewarefilefolder.png)


```bash
# logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    console.log(`Request: [${req.method}] - [${req.originalUrl}]`);

    next();
  }
}
```

```bash
# app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

##### Note: http://localhost:3000/ ei url visit korle request method o path console e show korbe

![](/public/Img/middlewareoutput.png)