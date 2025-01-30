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
import { TableService } from './table.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { TableDto } from './DTO/table.dto';
import { PositiveNumberPipe } from '../../shared/pipe/positive-number.pipe';

/**
 * Controller for managing tables within a restaurant.
 *
 * The `TableController` class provides endpoints for CRUD operations
 * related to tables in the restaurant database.
 */
@Controller('api/:idRestaurant/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  /**
   * Retrieves all tables for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @returns {Promise<any>} The list of tables.
   * @throws {NotFoundException} - Throws if no tables are found for the restaurant.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTable(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
  ) {
    try {
      const table = await this.tableService.findAll(Number(idRestaurant));
      if (!table || table.length === 0) {
        throw new NotFoundException();
      }
      return table.tables; // Ensure `tables` is properly defined in your service's return type
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
   * Retrieves a specific table by its ID for a given restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the table.
   * @returns {Promise<any>} The table.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during retrieval.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneTable(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const table = await this.tableService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!table) {
        throw new NotFoundException();
      }
      return table.tables[0]; // Ensure `tables` is properly defined in your service's return type
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
   * Creates a new table for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {tableDto} createtableDto - The request containing table data.
   * @returns {Promise<any>} The created table.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {HttpException} - Throws if there is an error during creation.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTable(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Body() createtableDto: TableDto,
  ) {
    try {
      const createdtable = await this.tableService.createOne(
        Number(idRestaurant),
        createtableDto,
      );
      if (createdtable.modifiedCount === 0) {
        throw new NotFoundException();
      }
      if (createdtable.matchedCount === 0) {
        throw new NotFoundException();
      }
      return createdtable;
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
   * Updates an existing table for a specific restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the table to update.
   * @param {tableDto} updateTableDto - The request containing updated table data.
   * @returns {Promise<any>} The update result message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {HttpException} - Throws if there is an error during the update.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateOneTable(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
    @Body() updateTableDto: TableDto,
  ) {
    try {
      const result = await this.tableService.updateOne(
        Number(idRestaurant),
        Number(id),
        updateTableDto,
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
   * Deletes a specific table for a restaurant.
   *
   * @param {number} idRestaurant - The ID of the restaurant.
   * @param {number} id - The ID of the table to delete.
   * @returns {Promise<any>} The delete result message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {HttpException} - Throws if there is an error during deletion.
   * @async
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOneTable(
    @Param('idRestaurant', PositiveNumberPipe) idRestaurant: number,
    @Param('id', PositiveNumberPipe) id: number,
  ) {
    try {
      const result = await this.tableService.deleteOne(
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
