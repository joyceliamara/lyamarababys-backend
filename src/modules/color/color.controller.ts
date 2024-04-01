import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorInput } from '../../shared/inputs/color/create-color-input';
import { UpdateColorInput } from '../../shared/inputs/color/upadte-color-input';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  async create(@Body() body: CreateColorInput) {
    return this.colorService.create(body);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.colorService.find(id);
  }

  @Get()
  async findAll() {
    return this.colorService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateColorInput) {
    return this.colorService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
