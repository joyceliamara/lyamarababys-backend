import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import CreateProductDTO from './dtos/create-product.dto';
import UpdateProductDTO from './dtos/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':idOrPath')
  findOne(@Param('idOrPath') idOrPath: string) {
    return this.productService.findOne(idOrPath);
  }

  @Post()
  create(@Body() body: CreateProductDTO) {
    return this.productService.create(body);
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
