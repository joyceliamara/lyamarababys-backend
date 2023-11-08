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
  Patch,
  Delete,
} from '@nestjs/common';
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
import AddToCartDTO from './dtos/add-to-cart.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthGuard } from '../../guards/auth.guard';
import AuthenticatedRequest from '../../interfaces/authenticated-request';
import SetMainImageDTO from './dtos/set-main-image.dto';
import AddProductImageDTO from './dtos/add-product-image.dto';

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
  async list(@Query() query: FilterProductsDTO) {
    return await this.productService.list(query);
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
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.favoriteProduct(productId, user.id);
  }

  @Post('unfavorite/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async unfavoriteProduct(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.unfavoriteProduct(productId, user.id);
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  async getCart(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return await this.productService.getCart(user.id);
  }

  @Post('cart/add')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() body: AddToCartDTO,
  ) {
    const { user } = req;

    await this.productService.addToCart(body, user.id);
  }

  @Post('cart/remove/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.removeFromCart(productId, user.id);
  }

  @Post('image')
  @UseGuards(AdminGuard)
  async addImage(@Body() body: AddProductImageDTO) {
    return await this.productService.addImage(body);
  }

  @Patch('image/set-main')
  @UseGuards(AdminGuard)
  async setMainImage(@Body() body: SetMainImageDTO) {
    return await this.productService.setMainImage(body);
  }

  @Delete('image/:imageId')
  @UseGuards(AdminGuard)
  async deleteImage(@Param('imageId') imageId: string) {
    return await this.productService.deleteImage(imageId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.productService.getById(id);
  }
}
