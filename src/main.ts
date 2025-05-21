import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // avoid user passing invaild properts
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply Middlewares
  app.use(helmet());
  // Cors Policy
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  // Swagger
  const swagger = new DocumentBuilder()
    .setTitle('Anghami Clone API')
    .setDescription('Your API description')
    .addServer('http://localhost:8080')
    .setTermsOfService('http:localhost:8080/terms-of-service')
    .setLicense('MIT License', 'https://opensource.org/license/mit')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBasicAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  // http:localhost:8080/swagger
  SwaggerModule.setup('swagger', app, documentation);

  // Running the app
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
