import { Injectable } from '@nestjs/common';
import CreateGenderDTO from '../product-old/dtos/create-gender.dto';
import UpdateGenderDTO from './dtos/update-gender.dto';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class GenderService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateGenderDTO) {
    return this.prismaService.gender.create({
      data,
    });
  }

  findAll() {
    return this.prismaService.gender.findMany();
  }

  findOne(id: string) {
    return this.prismaService.gender.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: UpdateGenderDTO) {
    return this.prismaService.gender.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return this.prismaService.gender.delete({
      where: {
        id,
      },
    });
  }
}
