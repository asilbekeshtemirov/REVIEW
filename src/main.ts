import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  app.enableCors({
    allowedHeaders: ['authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionSuccessStatus: 200,
    origin: process.env.CORS_ORIGIN,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth("accesstoken")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  if (process.env?.NODE_ENV?.trim() === 'development') {
    SwaggerModule.setup('docs', app, documentFactory);
  }


  const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT):3000;
  await app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}
bootstrap();
