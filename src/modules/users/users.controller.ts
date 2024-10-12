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
import { Request } from 'express'; // Ensure to import Request from express

@Controller('api/:idRestaurant/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves all users for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} An array of users.
   */
  @Get()
  async getAllUser(@Param('idRestaurant') idRestaurant: number) {
    try {
      const users = await this.usersService.findAll(Number(idRestaurant));
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching users: ${error}`);
    }
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<any>} The user object if found.
   */
  @Get(':id')
  async getOneUser(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const user = await this.usersService.findById(Number(idRestaurant), Number(id));
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching user with id ${id}: ${error}`);
    }
  }

  /**
   * Creates a new user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {Request} request - The request object containing user data.
   * @returns {Promise<any>} The created user object.
   */
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

  /**
   * Updates an existing user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @param {Request} request - The request object containing updated user data.
   * @returns {Promise<any>} A success message.
   */
  @Put(':id')
  async updateOneUser(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
    @Req() request: Request,
  ) {
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
        throw new BadRequestException(`No changes made to the user with id ${id}`);
      }
      return { message: `User with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user with id ${id}: ${error}`);
    }
  }

  /**
   * Deletes a user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<any>} A success message.
   */
  @Delete(':id')
  async deleteOneUser(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const result = await this.usersService.deleteOne(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user with id ${id}: ${error}`);
    }
  }
}
