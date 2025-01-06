/**
 * The AppService class provides core services for the application.
 * It contains methods related to the API's primary functionality.
 *
 * @class AppService
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a welcome message when the API is accessed.
   *
   * @returns {string} A message welcoming the user to the API.
   * @memberof AppService
   */
  Welcome(): string {
    return 'Access the API documentation at /api';
  }
}
