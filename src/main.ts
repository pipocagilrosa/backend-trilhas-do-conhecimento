import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';
import corsConfig from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig());
  const config = new DocumentBuilder()
    .setTitle('Pipoca Agil BackEnd')
    .setDescription('The Pipoca Agil BackEnd API description')
    .setVersion('1.5')
    .addTag('PipocaAgil')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const port = process.env.PORT || 4000

  // SwaggerModule setup (see https://docs.nestjs.com/recipes/swagger)
  SwaggerModule.setup('api', app, document);

  // Global Guards (see https://docs.nestjs.com/guards#global-guards)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));

  // app starts listening on port
  await app.listen(10000);
}
bootstrap();
