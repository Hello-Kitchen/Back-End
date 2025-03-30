import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UsersDto } from './DTO/users.dto';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';

@Controller('api/:idRestaurant/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves all users for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} An array of users.
   * @throws {NotFoundException} - Throws if no users are found for the restaurant.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const users = await this.usersService.findAll(Number(idRestaurant));
      if (!users || users.length === 0) {
        throw new NotFoundException();
      }
      return users.users.map(({ password, ...user }) => user);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieves a single user by their ID.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<any>} The user object if found.
   * @throws {NotFoundException} - Throws if the user is not found.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneUser(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const user = await this.usersService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!user) {
        throw new NotFoundException();
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Creates a new user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {UsersDto} createUsersDto - The request object containing user data.
   * @returns {Promise<any>} The created user object.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {HttpException} - Throws if there is an error during creation.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() createUsersDto: UsersDto,
  ) {
    try {
      const createdUser = await this.usersService.createOne(
        Number(idRestaurant),
        createUsersDto,
      );
      if (!createdUser) {
        throw new BadRequestException();
      }
      return createdUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an existing user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @param {UsersDto} updateUsersDto - The request object containing updated user data.
   * @returns {Promise<any>} A success message.
   * @throws {NotFoundException} - Throws if the user is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {HttpException} - Throws if there is an error during the update.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneUser(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateUsersDto: UsersDto,
  ) {
    try {
      const result = await this.usersService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateUsersDto,
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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes a user for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the user.
   * @returns {Promise<any>} A success message.
   * @throws {NotFoundException} - Throws if the user is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneUser(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.usersService.deleteOne(
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
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
