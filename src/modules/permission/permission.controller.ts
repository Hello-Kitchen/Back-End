import {
  Controller,
  Get,
  Req,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

/**
 * Controller for managing permissions.
 *
 * The `PermissionController` class handles incoming requests
 * related to permissions, delegating the logic to the `PermissionService`.
 */
@Controller('api/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Retrieves all permissions for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @returns {Promise<any>} - A promise that resolves to an array of permissions.
   * @throws {NotFoundException} - Throws if no permissions are found for the restaurant.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPermission(@Param('idRestaurant') idRestaurant: number) {
    try {
      const permissions = await this.permissionService.findAll(Number(idRestaurant));
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException();
      }
      return permissions.permissions;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves a specific permission by its ID for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the permission.
   * @returns {Promise<any>} - A promise that resolves to the requested permission.
   * @throws {NotFoundException} - Throws if the permission is not found.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOnePermission(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const permission = await this.permissionService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!permission) {
        throw new NotFoundException();
      }
      return permission.permissions[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new permission for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {Request} request - The request object containing permission data.
   * @returns {Promise<any>} - A promise that resolves to the created permission.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {HttpException} - Throws if there is an error during creation.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPermission(
    @Param('idRestaurant') idRestaurant: number,
    @Req() request: Request,
  ) {
    try {
      const createdPermission = await this.permissionService.createOne(
        Number(idRestaurant),
        request.body,
      );
      if (createdPermission.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdPermission.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdPermission;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Updates an existing permission for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the permission to be updated.
   * @param {Request} request - The request object containing updated permission data.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the permission is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {HttpException} - Throws if there is an error during the update.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOnePermission(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
    @Req() request: Request,
  ) {
    try {
      const result = await this.permissionService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException();
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes a specific permission for a restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the permission to be deleted.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the permission is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOnePermission(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const result = await this.permissionService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException();
      }
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
