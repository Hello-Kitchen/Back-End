/**
 * Main entry point of the NestJS application.
 * This function initializes the NestJS application using the main `AppModule`.
 *
 * @packageDocumentation
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

/**
 * The bootstrap function initializes the application and starts it on port 3000.
 *
 * - Uses `NestFactory.create` to create the application based on the `AppModule`.
 * - The `{ abortOnError: false }` option ensures that the application does not stop
 *   in case of critical errors during initialization.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} Returns a promise that resolves when the application starts.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove undefined properties in the DTO
      forbidNonWhitelisted: true, // Throw an error if undefined properties are present
      transform: true, // Transform the values according to the type specified in the DTO
    }),
  );

  // Loading Swagger file
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join("docs", "swagger.json"), "utf-8"),
  );

  // Served documentation with SwaggerUI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
