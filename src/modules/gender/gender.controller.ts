import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GenderService } from './gender.service';
import CreateGenderDTO from '../product/dtos/create-gender.dto';
import { UpdateGenderInput } from '../../shared/inputs/gender/update-gender-input';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Post()
  async create(@Body() body: CreateGenderDTO) {
    return this.genderService.create(body);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.genderService.find(id);
  }

  @Get()
  async findAll() {
    return this.genderService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateGenderInput) {
    return this.genderService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.genderService.delete(id);
  }
}
