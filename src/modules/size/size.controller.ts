import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import CreateSizeDTO from './dtos/create-size.dto';
import UpdateSizeDTO from './dtos/update-size.dto';
import { SizeService } from './size.service';

@Controller('size')
export class SizeController {
  constructor(private readonly colorService: SizeService) {}

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateSizeDTO) {
    return this.colorService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateSizeDTO) {
    return this.colorService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }
}
