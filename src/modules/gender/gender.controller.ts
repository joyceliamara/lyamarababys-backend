import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import UpdateColorDTO from '../color/dtos/update-color.dto';
import { GenderService } from './gender.service';
import CreateColorDTO from '../color/dtos/create-color.dto';
import CreateGenderDTO from './dtos/create-gender.dto';
import UpdateGenderDTO from './dtos/update-gender.dto';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  findAll() {
    return this.genderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genderService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateGenderDTO) {
    return this.genderService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateGenderDTO) {
    return this.genderService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genderService.remove(id);
  }
}
