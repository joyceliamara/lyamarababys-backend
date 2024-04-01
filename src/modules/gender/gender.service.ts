import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateGenderInput } from '../../shared/inputs/gender/create-gender-input';
import { UpdateGenderInput } from '../../shared/inputs/gender/update-gender-input';

@Injectable()
export class GenderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGenderInput) {
    const exists = !!(await this.prisma.gender.findFirst({
      where: { name: data.name },
    }));

    if (exists) {
      throw new ConflictException('Gênero já existe');
    }

    return this.prisma.gender.create({ data });
  }

  async find(id: string) {
    return this.prisma.gender.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.gender.findMany();
  }

  async update(id: string, data: UpdateGenderInput) {
    return this.prisma.gender.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.gender.delete({ where: { id } });
  }
}
