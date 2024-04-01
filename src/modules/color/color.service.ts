import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateColorInput } from '../../shared/inputs/color/create-color-input';
import { UpdateColorInput } from '../../shared/inputs/color/upadte-color-input';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateColorInput) {
    return this.prisma.color.create({ data });
  }

  async find(id: string) {
    return this.prisma.color.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.color.findMany();
  }

  async update(id: string, data: UpdateColorInput) {
    return this.prisma.color.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.color.delete({ where: { id } });
  }
}
