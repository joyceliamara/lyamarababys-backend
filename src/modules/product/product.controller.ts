import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CreateProductDTO from './dtos/create-product.dto';
import { ProductService } from './product.service';
import CategoryService from './category.service';
import CreateCategoryDTO from './dtos/create-category.dto';
import GenderService from './gender.service';
import CreateGenderDTO from './dtos/create-gender.dto';
import SizeService from './size.service';
import CreateSizeDTO from './dtos/create-size.dto';
import CreateColorDTO from './dtos/create-color.dto';
import ColorService from './color.service';
import FilterProductsDTO from './dtos/filter-products.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly genderService: GenderService,
    private readonly sizeService: SizeService,
    private readonly colorService: ColorService,
  ) {}

  @Post()
  async create(@Body() body: CreateProductDTO) {
    return await this.productService.create(body);
  }

  @Get()
  async list(@Query() params: FilterProductsDTO) {
    return await this.productService.list(params);
  }

  @Post('category')
  async createCategory(@Body() body: CreateCategoryDTO) {
    return await this.categoryService.create(body);
  }

  @Get('category')
  async listCategories() {
    return await this.categoryService.list();
  }

  @Post('gender')
  async createGender(@Body() body: CreateGenderDTO) {
    return await this.genderService.create(body);
  }

  @Get('gender')
  async listGender() {
    return await this.genderService.list();
  }

  @Post('size')
  async createSize(@Body() body: CreateSizeDTO) {
    return await this.sizeService.create(body);
  }

  @Get('size')
  async listSize() {
    return await this.sizeService.list();
  }

  @Post('color')
  async createColor(@Body() body: CreateColorDTO) {
    return await this.colorService.create(body);
  }

  @Get('color')
  async listColor() {
    return await this.colorService.list();
  }
}
