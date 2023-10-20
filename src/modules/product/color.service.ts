import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import CreateColorDTO from './dtos/create-color.dto';
import { PrismaService } from '../../services/prisma.service';
import colorSchema from '../../schemas/color.schema';

@Injectable()
export default class ColorService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateColorDTO) {
    const validation = colorSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const color = await this.client.color.findUnique({
      where: {
        name: validation.data.name,
      },
    });

    if (color) {
      throw new UnprocessableEntityException('Color already exists');
    }

    return await this.client.color.create({
      data: {
        name: validation.data.name,
        code: validation.data.code,
      },
    });
  }

  async list() {
    return await this.client.color.findMany();
  }
}
