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
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser() {
    try {
      const users = await this.usersService.findAll();
      if (!users || users.length === 0) {
        throw new NotFoundException('No Users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching Users: ${error}`);
    }
  }

  @Get(':id')
  async getOneUser(@Param('id') id: number) {
    try {
      const user = await this.usersService.findById(Number(id));
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching user with id ${id}: ${error}`,
      );
    }
  }

  @Post()
  async createUser(@Req() request: Request) {
    try {
      const createdUser = await this.usersService.createOne(request.body);
      if (!createdUser) {
        throw new BadRequestException('Error creating user');
      }
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating user: ${error}`);
    }
  }

  @Put(':id')
  async updateOneUser(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.usersService.updateOne(
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the user with id ${id}`,
        );
      }
      return { message: `User with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user with id ${id}: ${error}`,
      );
    }
  }

  @Delete(':id')
  async deleteOneUser(@Param('id') id: number) {
    try {
      const result = await this.usersService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting user with id ${id}: ${error}`,
      );
    }
  }
}
