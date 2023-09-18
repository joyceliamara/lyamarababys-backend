import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import CreateProductDTO from './dtos/create-product.dto';
import productSchema from 'src/schemas/product.schema';
import FilterProductsDTO from './dtos/filter-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateProductDTO) {
    const validation = productSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const { discount, name, price, sku, quantities } = validation.data;

    const sizesId = new Set(quantities.map((i) => i.sizeId));

    const [category, gender, color, sizes] = await Promise.all([
      this.client.category.findUnique({
        where: {
          id: data.categoryId,
        },
      }),
      this.client.gender.findUnique({
        where: {
          id: data.genderId,
        },
      }),
      this.client.color.findUnique({
        where: {
          id: data.colorId,
        },
      }),
      this.client.size.findMany({
        where: {
          id: {
            in: [...sizesId],
          },
        },
      }),
    ]);

    if (sizes.length !== sizesId.size) {
      const notFoundId = sizes.filter((i) => !sizesId.has(i.id));

      throw new UnprocessableEntityException(
        `Canoot found size id: ${notFoundId.join(', ')}`,
      );
    }

    if (!category) {
      throw new UnprocessableEntityException('Category not found');
    } else if (!gender) {
      throw new UnprocessableEntityException('Gender not found');
    } else if (!color) {
      throw new UnprocessableEntityException('Color not found');
    }

    return await this.client.product.create({
      data: {
        discount: discount,
        name: name,
        price: price,
        sku: sku,
        categories: {
          connect: {
            id: category.id,
          },
        },
        genders: {
          connect: {
            id: gender.id,
          },
        },
        colors: {
          connect: {
            id: color.id,
          },
        },
        quantities: {
          create: quantities.map((i) => ({
            sizeId: i.sizeId,
            count: i.count,
          })),
        },
      },
    });
  }

  async list(data: FilterProductsDTO) {
    console.log(data);

    return await this.client.product.findMany({
      where: {
        AND: [
          ...(data.name
            ? [
                {
                  name: {
                    contains: data.name,
                  },
                },
              ]
            : []),
          ...(data.category
            ? [
                {
                  categories: {
                    some: {
                      id: {
                        in: data.category,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(data.gender
            ? [
                {
                  genders: {
                    some: {
                      id: {
                        in: data.gender,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(data.color
            ? [
                {
                  colors: {
                    some: {
                      id: {
                        in: data.color,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(data.size
            ? [
                {
                  quantities: {
                    some: {
                      count: {
                        gt: 0,
                      },
                      size: {
                        id: {
                          in: data.size,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        quantities: {
          include: {
            size: true,
          },
        },
      },
    });
  }
}
