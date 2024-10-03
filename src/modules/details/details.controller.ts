import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DetailsService } from './details.service';

@Controller('api/details/:idRestaurant')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Get()
  async getAllDetail(@Param('idRestaurant') idRestaurant: number) {
    try {
      const details = await this.detailsService.findAll(Number(idRestaurant));
      if (!details || details.length === 0) {
        throw new NotFoundException('No details found');
      }
      return details.details;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching details');
    }
  }

  @Get(':id')
  async getOneDetail(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const detail = await this.detailsService.findById(Number(idRestaurant), Number(id));
      if (!detail) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return detail.details[0];
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching detail with id ${id}`);
    }
  }

  @Post()
  async createDetail(@Param('idRestaurant') idRestaurant: number, @Req() request: Request) {
    try {
      const createdDetail = await this.detailsService.createOne(Number(idRestaurant), request.body);
      if (!createdDetail) {
        throw new BadRequestException('Error creating detail');
      }
      return createdDetail;
    } catch (error) {
      throw new InternalServerErrorException('Error creating detail');
    }
  }

  @Put(':id')
  async updateOneDetail(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.detailsService.updateOne(Number(idRestaurant), Number(id), request.body);
      if (result.matchedCount === 0) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException(`No changes made to the detail with id ${id}`);
      }
      return { message: `Detail with id ${id} updated successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error updating detail with id ${id}`);
    }
  }

  @Delete(':id')
  async deleteOneDetail(@Param('idRestaurant') idRestaurant: number, @Param('id') id: number) {
    try {
      const result = await this.detailsService.deleteOne(Number(idRestaurant), Number(id));
      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return { message: `Detail with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting detail with id ${id}`);
    }
  }
}
