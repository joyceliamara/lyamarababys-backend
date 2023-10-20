import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateCategoryDTO from './dtos/create-category.dto';
import categorySchema from '../../schemas/category.schema';

@Injectable()
export default class CategoryService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateCategoryDTO) {
    const validation = categorySchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const existingCategory = await this.client.category.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    return await this.client.category.create({
      data: {
        name: data.name,
      },
    });
  }

  async list() {
    return await this.client.category.findMany();
  }
}
