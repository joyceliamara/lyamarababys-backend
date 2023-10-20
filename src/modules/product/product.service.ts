import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateProductDTO from './dtos/create-product.dto';
import FilterProductsDTO from './dtos/filter-products.dto';
import AddToCartDTO from './dtos/add-to-cart.dto';
import productSchema from '../../schemas/product.schema';

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

  async favoriteProduct(productId: string, userId: string) {
    const product = await this.client.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          connect: {
            id: product.id,
          },
        },
      },
    });
  }

  async unfavoriteProduct(productId: string, userId: string) {
    const product = await this.client.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id: product.id,
          },
        },
      },
    });
  }

  async getCart(userId: string) {
    return await this.client.cart.findMany({
      where: {
        userId,
        orderId: null,
      },
    });
  }

  async addToCart(data: AddToCartDTO, userId: string) {
    const product = await this.client.product.findUnique({
      where: {
        id: data.productId,
        quantities: {
          some: {
            sizeId: data.sizeId,
          },
        },
        colors: {
          some: {
            id: data.colorId,
          },
        },
      },
      include: {
        quantities: true,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    } else if (product.quantities[0].count < data.quantity) {
      throw new BadRequestException(
        'Quantity of products available is not enough',
      );
    }

    const existsItemCart = await this.client.cart.findFirst({
      where: {
        userId,
        productId: product.id,
        orderId: null,
      },
    });

    if (existsItemCart) {
      const availableQuantities = product.quantities.find(
        (i) => i.sizeId === existsItemCart.sizeId,
      ).count;

      if (existsItemCart.quantity + data.quantity > availableQuantities) {
        throw new BadRequestException({
          message: `Quantity unavailable for ${product.name} product`,
          productId: product.id,
        });
      }

      await this.client.cart.update({
        where: {
          id: existsItemCart.id,
        },
        data: {
          quantity: {
            increment: data.quantity,
          },
        },
      });
    } else {
      const availableQuantities = product.quantities.find(
        (i) => i.sizeId === existsItemCart.sizeId,
      ).count;

      if (data.quantity > availableQuantities) {
        throw new BadRequestException({
          message: `Quantity unavailable for ${product.name} product`,
          productId: product.id,
        });
      }

      await this.client.cart.create({
        data: {
          quantity: data.quantity,
          product: {
            connect: {
              id: data.productId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          color: {
            connect: {
              id: data.colorId,
            },
          },
          size: {
            connect: {
              id: data.sizeId,
            },
          },
        },
      });
    }
  }

  async removeFromCart(productId: string, userId: string) {
    const item = await this.client.cart.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (!item) {
      throw new BadRequestException('Item not found');
    }

    await this.client.cart.delete({
      where: {
        id: item.id,
      },
    });
  }
}
