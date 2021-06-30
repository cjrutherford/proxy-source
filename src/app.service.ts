import { Inject, Injectable } from '@nestjs/common';
import LocalCache from './localCache';
import {createHash} from 'crypto'

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_CACHE') private readonly userCache: LocalCache,
    @Inject('TOKEN_CACHE') private readonly tokenCache: LocalCache,
    @Inject('TOKEN_SECRET') private readonly tokenSecret: string
  ){}
  async register(username: string, password: string, confirm: string): Promise<boolean> {
    try{

      const existing = await this.userCache.get(username);
      console.log("🚀 ~ file: app.service.ts ~ line 18 ~ AppService ~ register ~ existing", existing)
      if(existing) throw new Error('User already Exists.');

      if(password === confirm){
        const hash = createHash('sha256').update(password).digest('hex');
        console.log("🚀 ~ file: app.service.ts ~ line 23 ~ AppService ~ register ~ hash", hash)
        const save = await this.userCache.set(username, hash).catch(err => console.error(err));
        console.log("🚀 ~ file: app.service.ts ~ line 23 ~ AppService ~ register ~ save", save)
        if(!save) throw new Error('unable to save to cache.');
        return !!save;
      } else {
        throw new Error('Passwrods do not match');
      }

    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async login(username: string, password: string): Promise<any> {
    try {
      const user = await this.userCache.get(username);
      console.log("🚀 ~ file: app.service.ts ~ line 40 ~ AppService ~ login ~ user", user)
      if(!user) throw new Error('unable to retrieve user from database.');
      const rehash = createHash('sha256').update(password).digest('hex');
      console.log("🚀 ~ file: app.service.ts ~ line 43 ~ AppService ~ login ~ rehash", rehash)
      if(user === rehash){
        return await this.issueToken(username);
      } else {
        throw new Error('Passwords do not match.');
      }
    } catch (e) {
      throw e;
    }
  }

  private async issueToken(username: string): Promise<string>{
    try {
      const userToken: {token: string, revoked: boolean} = await this.tokenCache.get(username);
      console.log("🚀 ~ file: app.service.ts ~ line 57 ~ AppService ~ issueToken ~ userToken", userToken)
      if(!!userToken){
        const {revoked, token} = userToken;
        if(!revoked){
          console.log("🚀 ~ file: app.service.ts ~ line 61 ~ AppService ~ issueToken ~ notRevoked", revoked)
          return token;
        } 
      }

      const newToken = jwt.sign(username, this.tokenSecret, {algorithm: 'HS512'});
      console.log("🚀 ~ file: app.service.ts ~ line 67 ~ AppService ~ issueToken ~ newToken", newToken)

      const saved = await this.tokenCache.set(username, {token: newToken, revoked: false});
      console.log("🚀 ~ file: app.service.ts ~ line 70 ~ AppService ~ issueToken ~ saved", saved)
      if(!saved) throw new Error('unable to save new token.');
      return newToken;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
