import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../services/prisma.service';
import GenderService from './gender.service';
import SizeService from './size.service';
import ColorService from './color.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    GenderService,
    SizeService,
    ColorService,
  ],
})
export class ProductModule {}
