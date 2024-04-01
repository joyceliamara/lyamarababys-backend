import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeInput } from '../../shared/inputs/size/create-size-input';
import { UpdateSizeInput } from '../../shared/inputs/size/update-size-input';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  async create(@Body() body: CreateSizeInput) {
    return this.sizeService.create(body);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.sizeService.find(id);
  }

  @Get()
  async findAll() {
    return this.sizeService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateSizeInput) {
    return this.sizeService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.sizeService.delete(id);
  }
}
