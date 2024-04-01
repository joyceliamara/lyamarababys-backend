import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import CreateCategoryDTO from '../product/dtos/create-category.dto';
import { UpdateCategoryInput } from '../../shared/inputs/caterogy/update-category-input';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() body: CreateCategoryDTO) {
    return this.categoryService.create(body);
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.categoryService.find(id);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCategoryInput) {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
