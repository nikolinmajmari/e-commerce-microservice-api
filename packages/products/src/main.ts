/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.enableCors();

  const config = new DocumentBuilder()
  .setTitle("Products api")
  .setDescription("The doc of products microservice api")
  .setVersion("1.0")
  .addTag("products")
  .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("api",app,document);
  const port = process.env.PORT || 3333;

  // connect to kafka 
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options:{
      client:{
        brokers: [process.env.KAFKA_BROKER_1]
      },
      consumer:{
        groupId: "product_consumer_id"
      }
    }
  })


  await app.listen(port);
  await app.startAllMicroservices();
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
