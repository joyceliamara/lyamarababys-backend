import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateSizeDTO from './dtos/create-size.dto';
import UpdateSizeDTO from './dtos/update-size.dto';

@Injectable()
export class SizeService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateSizeDTO) {
    return this.prismaService.size.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.size.findMany();
  }

  findOne(id: string) {
    return this.prismaService.size.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdateSizeDTO) {
    return this.prismaService.size.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.size.delete({
      where: {
        id,
      },
    });
  }
}
