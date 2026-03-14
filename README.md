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

##### Note: url visit korle request method o path console e show korbe

![](/public/Img/middlewareoutput.png)


```bash
# logger.middleware.ts
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
```

![](/public/Img/middlewareoutput2.png)


NestJS এ Middleware হলো এমন একটি ফাংশন বা ক্লাস যা Request (req) এবং Response (res) এর মাঝখানে কাজ করে।
অর্থাৎ, কোনো request controller এ যাওয়ার আগে middleware execute হয়।

সহজভাবে বললে:

👉 Client → Middleware → Controller → Response

মানে client থেকে request আসলে প্রথমে middleware check করবে, তারপর controller এ যাবে।

---

#### Middleware কেন ব্যবহার করা হয়?

Middleware সাধারণত এই কাজগুলোর জন্য ব্যবহার করা হয়:

- Logging (request log করা)
- Authentication check করা
- Request modify করা
- Token check করা
- Headers add করা

---

#### Simple Example

ধরো আমরা একটি middleware বানাবো যা console এ message print করবে।

#### logger.middleware.ts

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request received');
    next();
  }
}
```

#### এখানে কী হচ্ছে

- `NestMiddleware` implement করা হয়েছে
- `use()` method middleware এর main function
- `next()` call করলে request পরের step এ যাবে

---

#### Middleware App এ ব্যবহার করা

#### app.module.ts

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

#### এখানে

`forRoutes('*')` মানে সব route এ middleware run হবে

---

#### Request Flow Example

ধরো user এই API call করলো:

GET /users

তখন flow হবে:

```
Client request
      ↓
Middleware run
      ↓
Controller run
      ↓
Response back
```

---

#### Middleware vs Guard (Short Idea)

| Middleware               | Guard                               |
| ------------------------ | ----------------------------------- |
| Request আসলে আগে run হয়  | Controller execute হওয়ার আগে run হয় |
| Express middleware এর মত | Authorization এর জন্য বেশি use হয়   |
| req modify করা যায়       | Access control check করে            |

---

#### Real Life Example

ধরো website এ login check করতে হবে।

Middleware check করবে:

```ts
if(!token){
   return "Unauthorized"
}
```

token থাকলে:

```
next()
```

তারপর controller run করবে।

---