import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateCategoryInput } from '../../shared/inputs/caterogy/create-category-input';
import { UpdateCategoryInput } from '../../shared/inputs/caterogy/update-category-input';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryInput) {
    const exists = !!(await this.prisma.category.findFirst({
      where: { name: data.name },
    }));

    if (exists) {
      throw new ConflictException('Categoria já existe');
    }

    return this.prisma.category.create({ data });
  }

  async find(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async update(id: string, data: UpdateCategoryInput) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
