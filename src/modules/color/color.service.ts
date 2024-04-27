import { Injectable } from '@nestjs/common';
import CreateColorDTO from './dtos/create-color.dto';
import { PrismaService } from '../../services/prisma.service';
import UpdateColorDTO from './dtos/update-color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateColorDTO) {
    return this.prismaService.color.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.color.findMany();
  }

  findOne(id: string) {
    return this.prismaService.color.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdateColorDTO) {
    return this.prismaService.color.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.color.delete({
      where: {
        id,
      },
    });
  }
}
