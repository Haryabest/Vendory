import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Vendory API')
    .setDescription('API для маркетплейса Vendory')
    .setVersion('1.0')
    .addTag('products', 'Управление товарами')
    .addTag('users', 'Управление пользователями')
    .addTag('categories', 'Управление категориями')
    .addTag('orders', 'Управление заказами')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
  console.log('Swagger is available on: http://localhost:3001/api');
}
bootstrap();
