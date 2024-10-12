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
} from '@nestjs/common';
import { PermissionService } from './permission.service';

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
   * Retrieves all permissions.
   *
   * @returns {Promise<any>} List of permissions.
   */
  @Get()
  async getAllPermission() {
    try {
      const permissions = await this.permissionService.findAll();
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException('No permissions found');
      }
      return permissions;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching permissions: ${error}`,
      );
    }
  }

  /**
   * Retrieves a specific permission by its ID.
   *
   * @param {number} id - The ID of the permission.
   * @returns {Promise<any>} The requested permission.
   */
  @Get(':id')
  async getOnePermission(@Param('id') id: number) {
    try {
      const permission = await this.permissionService.findById(Number(id));
      if (!permission) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching permission with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Creates a new permission.
   *
   * @param {Request} request - The incoming request containing the permission data.
   * @returns {Promise<any>} The created permission.
   */
  @Post()
  async createPermission(@Req() request: Request) {
    try {
      const createdPermission = await this.permissionService.createOne(
        request.body,
      );
      if (!createdPermission) {
        throw new BadRequestException('Error creating permission');
      }
      return createdPermission;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating permission: ${error}`,
      );
    }
  }

  /**
   * Updates an existing permission by its ID.
   *
   * @param {number} id - The ID of the permission to update.
   * @param {Request} request - The incoming request containing the updated data.
   * @returns {Promise<any>} Success message.
   */
  @Put(':id')
  async updateOnePermission(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.permissionService.updateOne(
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the permission with id ${id}`,
        );
      }
      return { message: `Permission with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating permission with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Deletes a permission by its ID.
   *
   * @param {number} id - The ID of the permission to delete.
   * @returns {Promise<any>} Success message.
   */
  @Delete(':id')
  async deleteOnePermission(@Param('id') id: number) {
    try {
      const result = await this.permissionService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      return { message: `Permission with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting permission with id ${id}: ${error}`,
      );
    }
  }
}
