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

@Controller('api/:idRestaurant/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser(@Param('idRestaurant') idRestaurant: number) {
    try {
      const users = await this.usersService.findAll(Number(idRestaurant));
      if (!users || users.length === 0) {
        throw new NotFoundException('No Users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching Users: ${error}`);
    }
  }

  @Get(':id')
  async getOneUser(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const user = await this.usersService.findById(Number(idRestaurant), Number(id));
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
  async createUser(@Param('idRestaurant') idRestaurant: number, @Req() request: Request) {
    try {
      const createdUser = await this.usersService.createOne(Number(idRestaurant), request.body);
      if (!createdUser) {
        throw new BadRequestException('Error creating user');
      }
      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating user: ${error}`);
    }
  }

  @Put(':id')
  async updateOneUser(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.usersService.updateOne(
        Number(idRestaurant),
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
  async deleteOneUser(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const result = await this.usersService.deleteOne(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
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
