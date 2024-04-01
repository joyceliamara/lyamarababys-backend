import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [PrismaService, CategoryService],
})
export class CategoryModule {}
