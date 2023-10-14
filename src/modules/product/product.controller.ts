import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
  Param,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import AddToCartDTO from './dtos/add-to-cart.dto';

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly genderService: GenderService,
    private readonly sizeService: SizeService,
    private readonly colorService: ColorService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateProductDTO) {
    return await this.productService.create(body);
  }

  @Get()
  async list(@Query() params: FilterProductsDTO) {
    return await this.productService.list(params);
  }

  @Post('category')
  @UseGuards(AdminGuard)
  async createCategory(@Body() body: CreateCategoryDTO) {
    return await this.categoryService.create(body);
  }

  @Get('category')
  async listCategories() {
    return await this.categoryService.list();
  }

  @Post('gender')
  @UseGuards(AdminGuard)
  async createGender(@Body() body: CreateGenderDTO) {
    return await this.genderService.create(body);
  }

  @Get('gender')
  async listGender() {
    return await this.genderService.list();
  }

  @Post('size')
  @UseGuards(AdminGuard)
  async createSize(@Body() body: CreateSizeDTO) {
    return await this.sizeService.create(body);
  }

  @Get('size')
  async listSize() {
    return await this.sizeService.list();
  }

  @Post('color')
  @UseGuards(AdminGuard)
  async createColor(@Body() body: CreateColorDTO) {
    return await this.colorService.create(body);
  }

  @Get('color')
  async listColor() {
    return await this.colorService.list();
  }

  @Post('favorite/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async favoriteProduct(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const user = req['user'] as { id: string; email: string };

    await this.productService.favoriteProduct(productId, user.id);
  }

  @Post('unfavorite/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async unfavoriteProduct(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const user = req['user'] as { id: string; email: string };

    await this.productService.unfavoriteProduct(productId, user.id);
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  async getCart(@Req() req: Request) {
    const user = req['user'] as { id: string; email: string };

    return await this.productService.getCart(user.id);
  }

  @Post('cart/add')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async addToCart(@Req() req: Request, @Body() body: AddToCartDTO) {
    const user = req['user'] as { id: string; email: string };

    await this.productService.addToCart(body, user.id);
  }

  @Post('cart/remove/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const user = req['user'] as { id: string; email: string };

    await this.productService.removeFromCart(productId, user.id);
  }
}
