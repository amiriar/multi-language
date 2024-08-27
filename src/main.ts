import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Now you can use useStaticAssets
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('MultiLanguage App API - NestJS')
    .setDescription('MultiLanguage App API Made By Amirreza Abdolrahimi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(3001);
}
bootstrap();
