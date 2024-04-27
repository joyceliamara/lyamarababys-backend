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
import CreateColorDTO from './dtos/create-color.dto';
import UpdateColorDTO from './dtos/update-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateColorDTO) {
    return this.colorService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateColorDTO) {
    return this.colorService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }
}
