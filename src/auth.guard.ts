import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import LocalCache from './localCache';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('TOKEN_CACHE') private readonly tokenCache: LocalCache, @Inject('TOKEN_SECRET')private readonly tokenSecret: string){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("🚀 ~ file: auth.guard.ts ~ line 13 ~ AuthGuard ~ request", request.headers.authorization);
    const token = request.headers.authorization.split(' ')[1];
    console.log("🚀 ~ file: auth.guard.ts ~ line 15 ~ AuthGuard ~ token", token)
    const verified = jwt.verify(token, this.tokenSecret, {algorithms:['HS512']})
    console.log("🚀 ~ file: auth.guard.ts ~ line 16 ~ AuthGuard ~ verified", verified)
    return !!verified;
  }
}
