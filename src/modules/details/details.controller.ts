/**
 * Controller for managing details associated with a restaurant.
 * 
 * The `DetailsController` provides endpoints for retrieving, creating,
 * updating, and deleting detail objects for a specific restaurant.
 * 
 * @controller DetailsController
 */

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
import { DetailsService } from './details.service';

@Controller('api/:idRestaurant/details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  /**
   * Retrieves all details for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @returns {Promise<any>} - A promise that resolves to an array of details.
   * @throws {NotFoundException} - Throws if no details are found for the restaurant.
   * @throws {InternalServerErrorException} - Throws if there is an error during retrieval.
   * @async
   */
  @Get()
  async getAllDetail(@Param('idRestaurant') idRestaurant: number) {
    try {
      const details = await this.detailsService.findAll(Number(idRestaurant));
      if (!details || details.length === 0) {
        throw new NotFoundException('No details found');
      }
      return details.details;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching details: ${error}`,
      );
    }
  }

  /**
   * Retrieves a specific detail by its ID for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail.
   * @returns {Promise<any>} - A promise that resolves to the requested detail.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {InternalServerErrorException} - Throws if there is an error during retrieval.
   * @async
   */
  @Get(':id')
  async getOneDetail(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const detail = await this.detailsService.findById(
        Number(idRestaurant),
        Number(id),
      );
      if (!detail) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return detail.details[0];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching detail with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Creates a new detail for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {Request} request - The request object containing detail data.
   * @returns {Promise<any>} - A promise that resolves to the created detail.
   * @throws {BadRequestException} - Throws if there is an error during creation.
   * @throws {InternalServerErrorException} - Throws if there is an error during creation.
   * @async
   */
  @Post()
  async createDetail(
    @Param('idRestaurant') idRestaurant: number,
    @Req() request: Request,
  ) {
    try {
      const createdDetail = await this.detailsService.createOne(
        Number(idRestaurant),
        request.body,
      );
      if (!createdDetail) {
        throw new BadRequestException('Error creating detail');
      }
      return createdDetail;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating detail: ${error}`);
    }
  }

  /**
   * Updates an existing detail for a specific restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail to be updated.
   * @param {Request} request - The request object containing updated detail data.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {BadRequestException} - Throws if no changes are made.
   * @throws {InternalServerErrorException} - Throws if there is an error during the update.
   * @async
   */
  @Put(':id')
  async updateOneDetail(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
    @Req() request: Request,
  ) {
    try {
      const result = await this.detailsService.updateOne(
        Number(idRestaurant),
        Number(id),
        request.body,
      );
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(
          `No changes made to the detail with id ${id}`,
        );
      }
      return { message: `Detail with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating detail with id ${id}: ${error}`,
      );
    }
  }

  /**
   * Deletes a specific detail for a restaurant.
   * 
   * @param {number} idRestaurant - The unique identifier of the restaurant.
   * @param {number} id - The unique identifier of the detail to be deleted.
   * @returns {Promise<any>} - A promise that resolves to a success message.
   * @throws {NotFoundException} - Throws if the detail is not found.
   * @throws {InternalServerErrorException} - Throws if there is an error during deletion.
   * @async
   */
  @Delete(':id')
  async deleteOneDetail(
    @Param('idRestaurant') idRestaurant: number,
    @Param('id') id: number,
  ) {
    try {
      const result = await this.detailsService.deleteOne(
        Number(idRestaurant),
        Number(id),
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return { message: `Detail with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting detail with id ${id}: ${error}`,
      );
    }
  }
}
