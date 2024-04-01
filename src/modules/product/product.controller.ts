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
import CreateColorDTO from './dtos/create-color.dto';
import ColorService from './color.service';
import FilterProductsDTO from './dtos/filter-products.dto';
import AddToCartDTO from './dtos/add-to-cart.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthGuard } from '../../guards/auth.guard';
import AuthenticatedRequest from '../../interfaces/authenticated-request';
import SetMainImageDTO from './dtos/set-main-image.dto';
import AddProductImageDTO from './dtos/add-product-image.dto';
import { IdentifierGuard } from '../../guards/identifier.guard';

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
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

  @Post('color')
  @UseGuards(AdminGuard)
  async createColor(@Body() body: CreateColorDTO) {
    return await this.colorService.create(body);
  }

  @Get('color')
  async listColor() {
    return await this.colorService.list();
  }

  @Get('favorite')
  @UseGuards(AuthGuard)
  async listFavorites(@Req() req: AuthenticatedRequest) {
    return await this.productService.listFavorites(req.user['sub']);
  }

  @Post('favorite/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async favoriteProduct(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.favoriteProduct(productId, user['sub']);
  }

  @Post('unfavorite/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async unfavoriteProduct(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.unfavoriteProduct(productId, user['sub']);
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  async getCart(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return await this.productService.getCart(user['sub']);
  }

  @Post('cart/add')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() body: AddToCartDTO,
  ) {
    const { user } = req;

    await this.productService.addToCart(body, user['sub']);
  }

  @Post('cart/remove/:productId')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: string,
  ) {
    const { user } = req;

    await this.productService.removeFromCart(productId, user['sub']);
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
  @UseGuards(IdentifierGuard)
  async getById(
    @Req() req: Partial<AuthenticatedRequest>,
    @Param('id') id: string,
  ) {
    const { user } = req;

    return await this.productService.getById(
      id,
      user ? user['sub'] : undefined,
    );
  }
}
