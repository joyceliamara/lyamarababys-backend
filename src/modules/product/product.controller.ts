import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import CreateProductDTO from './dtos/create-product.dto';
import UpdateProductDTO from './dtos/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import AuthenticatedRequest from '../../interfaces/authenticated-request';
import { IdentifierGuard } from '../../guards/identifier.guard';
import AddProductToCardDTO from './dtos/add-product-to-card.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('cart')
  @UseGuards(AuthGuard)
  getCart(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return this.productService.getCart(user.sub);
  }

  @Get(':idOrPath')
  @UseGuards(IdentifierGuard)
  findOne(
    @Param('idOrPath') idOrPath: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req?.user;

    return this.productService.findOne(idOrPath, user?.sub);
  }

  @Post()
  create(@Body() body: CreateProductDTO) {
    return this.productService.create(body);
  }

  @Post('favorite/:id')
  @UseGuards(AuthGuard)
  favorite(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { user } = req;

    return this.productService.favorite(user.sub, id);
  }

  @Post('unfavorite/:id')
  @UseGuards(AuthGuard)
  unfavorite(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { user } = req;

    return this.productService.unfavorite(user.sub, id);
  }

  @Post('cart/add')
  @UseGuards(AuthGuard)
  addToCart(
    @Body() body: AddProductToCardDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;

    return this.productService.addToCart(body, user.sub);
  }

  @Put()
  update(@Body() body: UpdateProductDTO) {
    return this.productService.update(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
