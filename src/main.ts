/**
 * Main entry point of the NestJS application.
 * This function initializes the NestJS application using the main `AppModule`.
 * 
 * @packageDocumentation
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
