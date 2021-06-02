import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Proxy Target Example')
    .setDescription('Simple API to demonstrate the basic operations provided through a proxy with a nestJS api, and this is the proxy source which generates the original response.')
    .setVersion('0.0.1')
    .build();

    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('proxy-target', app, doc);
  await app.listen(3000);
}
bootstrap();
