import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import LocalCache from './localCache';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject('TOKEN_CACHE') private readonly tokenCache: LocalCache, @Inject('TOKEN_SECRET')private readonly tokenSecret: string){}
  use(req: any, res: any, next: () => void) {
    const token = req.headers['Authorization'].split(' ')[1];
    const verified = jwt.verify(token, this.tokenSecret, {algorithms:['HS512']})
    const payload = jwt.decode(token, {json: true});
    console.log("🚀 ~ file: auth.middleware.ts ~ line 11 ~ AuthMiddleware ~ use ~ payload", payload)
    if(!verified) res.error('Token is invalid.')
    next();
  }
}
