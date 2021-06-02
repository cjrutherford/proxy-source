import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth.middleware';
import LocalCache from './localCache';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService, 
    {provide:'USER_CACHE', useFactory: () => new LocalCache('user.json')},
    {provide:'TOKEN_CACHE', useFactory: () => new LocalCache('tokens.json')},
    {provide:'TOKEN_SECRET', useValue: 'alsd;fkqboeunoqne;drugba;dfnb;slniwu ieubna'},
  ],
})
export class AppModule {}
