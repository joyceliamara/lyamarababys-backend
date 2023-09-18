import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import CreateSizeDTO from './dtos/create-size.dto';
import sizeSchema from 'src/schemas/size.schema';

@Injectable()
export default class SizeService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateSizeDTO) {
    const validation = sizeSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    // validar se já existe um size com o mesmo nome

    return await this.client.size.create({
      data: {
        name: validation.data.name,
      },
    });
  }

  async list() {
    return await this.client.size.findMany();
  }
}
