import { Controller, Get, Req, Param, Post, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DetailsService } from './details.service';

@Controller('api/details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Get()
  async getAllDetail() {
    try {
      const details = await this.detailsService.findAll();
      if (!details || details.length === 0) {
        throw new NotFoundException('No details found');
      }
      return details;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching details');
    }
  }

  @Get(':id')
  async getOneDetail(@Param('id') id: number) {
    try {
      const detail = await this.detailsService.findById(Number(id));
      if (!detail) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return detail;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching detail with id ${id}`);
    }
  }

  @Post()
  async createDetail(@Req() request: Request) {
    try {
      const createdDetail = await this.detailsService.createOne(request.body);
      if (!createdDetail) {
        throw new BadRequestException('Error creating detail');
      }
      return createdDetail;
    } catch (error) {
      throw new InternalServerErrorException('Error creating detail');
    }
  }

  @Put(':id')
  async updateOneDetail(@Param('id') id: number, @Req() request: Request) {
    try {
      const result = await this.detailsService.updateOne(Number(id), request.body);
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
  async deleteOneDetail(@Param('id') id: number) {
    try {
      const result = await this.detailsService.deleteOne(Number(id));
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Detail with id ${id} not found`);
      }
      return { message: `Detail with id ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting detail with id ${id}`);
    }
  }
}
