import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitado para permitir peticiones desde el frontend en React
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
