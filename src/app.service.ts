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
      if(existing) throw new Error('User already Exists.');

      if(password === confirm){
        const hash = createHash('sha256').update(password).digest('hex');
        const save = await this.userCache.set(username, hash);
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
      if(!user) throw new Error('unable to retrieve user from database.');
      const rehash = createHash('sha256').update(password).digest('hex');
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
      const userTokens: {token: string, revoked: boolean}[] = await this.tokenCache.get(username);
      if(!!userTokens && userTokens.length > 0){
        const [notRevoked] = userTokens.filter(x => !x.revoked);
        if(notRevoked){
          return notRevoked.token;
        } 
      }

      const newToken = jwt.sign(username, this.tokenSecret, {algorithm: 'HS512'});

      const saved = await this.tokenCache.set(username, {token: newToken, revoked: false});
      if(!saved) throw new Error('unable to save new token.');
      return newToken;
    } catch (e) {
      throw e;
    }
  }
}
