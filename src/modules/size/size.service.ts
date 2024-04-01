import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateSizeInput } from '../../shared/inputs/size/create-size-input';
import { UpdateSizeInput } from '../../shared/inputs/size/update-size-input';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSizeInput) {
    const exists = !!(await this.prisma.size.findFirst({
      where: { name: data.name },
    }));

    if (exists) {
      throw new ConflictException('Tamanho já existe');
    }

    return this.prisma.size.create({ data });
  }

  async find(id: string) {
    return this.prisma.size.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.size.findMany();
  }

  async update(id: string, data: UpdateSizeInput) {
    return this.prisma.size.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.size.delete({ where: { id } });
  }
}
