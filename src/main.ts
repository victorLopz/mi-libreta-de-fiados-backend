import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // middlewares
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });

  // configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi Libreta de Fiados - API')
    .setDescription(
      'Documentación de la API del sistema de gestión de fiados, clientes y abonos.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Token JWT para autenticación',
        in: 'header',
      },
      'access-token', // nombre de la referencia
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
