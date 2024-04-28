import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import CreateProductDTO from './dtos/create-product.dto';
import { createProductSchema } from './schemas/create-product.schema';
import { updateProductSchema } from './schemas/update-product.schema';
import UpdateProductDTO from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateProductDTO) {
    const validation = createProductSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.message);
    }

    const sdkInUse = !!(await this.prisma.product.findFirst({
      where: {
        sku: data.sku,
      },
    }));

    if (sdkInUse) {
      throw new ConflictException('SKU already in use');
    }

    const [category, gender] = await Promise.all([
      this.prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      }),
      this.prisma.gender.findUnique({
        where: {
          id: data.genderId,
        },
      }),
    ]);

    if (!category) {
      throw new NotFoundException('Category not found');
    } else if (!gender) {
      throw new NotFoundException('Gender not found');
    }

    const path = `${data.name.replace(/\s/g, '-')}-${data.sku}`;

    return await this.prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        path,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
        gender: {
          connect: {
            id: data.genderId,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(idOrPath: string) {
    return await this.prisma.product.findFirst({
      where: {
        OR: [
          {
            id: idOrPath,
          },
          {
            path: idOrPath,
          },
        ],
      },
    });
  }

  async update(id: string, data: UpdateProductDTO) {
    const validation = updateProductSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.message);
    }

    const [category, gender] = await Promise.all([
      this.prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      }),
      this.prisma.gender.findUnique({
        where: {
          id: data.genderId,
        },
      }),
    ]);

    if (!category) {
      throw new NotFoundException('Category not found');
    } else if (!gender) {
      throw new NotFoundException('Gender not found');
    }

    const path = `${data.name.replace(/\s/g, '-')}-${data.sku}`;

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        path,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
        gender: {
          connect: {
            id: data.genderId,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
