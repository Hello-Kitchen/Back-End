/**
 * The AppController class handles incoming HTTP requests and routes them to the appropriate service methods.
 * 
 * It uses the `AppService` to handle the core logic and returns responses to the client.
 * 
 * @class AppController
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  /**
   * The constructor injects the `AppService` to handle business logic for the controller.
   * 
   * @param {AppService} appService - The service that provides core application logic.
   * @memberof AppController
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Handles GET requests to the root path ('/') and returns a welcome message.
   * 
   * This method uses the `AppService` to generate the welcome message for the API.
   * 
   * @returns {string} A welcome message from the API.
   * @memberof AppController
   */
  @Get()
  Welcome(): string {
    return this.appService.Welcome();
  }
}

