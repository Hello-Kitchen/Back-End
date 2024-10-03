import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('api/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getAllPermission() {
    try {
      const permissions = await this.permissionService.findAll();
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException('No permissions found');
      }
      return permissions;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching permissions');
    }
  }

  @Get(':id')
  async getOnePermission(@Param('id') id: number) {
    try {
      const permission = await this.permissionService.findById(Number(id));
      if (!permission) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      return permission;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching permission with id ${id}`);
    }
  }

  @Post()
  async createPermission(@Req() request: Request) {
    try {
      const createdPermission = await this.permissionService.createOne(request.body);
      if (!createdPermission) {
        throw new BadRequestException('Error creating permission');
      }
      return createdPermission;
    } catch (error) {
      throw new InternalServerErrorException('Error creating permission');
    }
  }

  @Put(':id')
  async updateOnePermission(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.permissionService.updateOne(Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the permission with id ${id}`);
      }
      return { message: `Permission with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating permission with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOnePermission(@Param('id') id: number) {
    try {
      const result = await this.permissionService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Permission with id ${id} not found`);
      }
      return { message: `Permission with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting permission with id ${id}`);
    }
  }
}
