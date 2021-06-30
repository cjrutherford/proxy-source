import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import LocalCache from './localCache';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService, 
    {provide:'TOKEN_SECRET', useValue: 'alsd;fkqboeunoqne;drugba;dfnb;slniwu ieubna'},
    {provide:'USER_CACHE', useFactory: () => new LocalCache('user.json')},
    {provide:'TOKEN_CACHE', useFactory: () => new LocalCache('tokens.json')},
  ],
})
export class AppModule {}
