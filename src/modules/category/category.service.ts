import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateCategoryDTO from './dtos/create-category.dto';
import UpdateCategoryDTO from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateCategoryDTO) {
    return this.prismaService.category.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  findOne(id: string) {
    return this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdateCategoryDTO) {
    return this.prismaService.category.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
