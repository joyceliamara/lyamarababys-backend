import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateGenderDTO from './dtos/create-gender.dto';
import genderSchema from '../../schemas/gender.schema';

@Injectable()
export default class GenderService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateGenderDTO) {
    const validation = genderSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const gender = await this.client.gender.findUnique({
      where: {
        name: validation.data.name,
      },
    });

    if (gender) {
      throw new BadRequestException('Gender already exists');
    }

    return await this.client.gender.create({
      data: {
        name: validation.data.name,
      },
    });
  }

  async list() {
    return await this.client.gender.findMany();
  }
}
