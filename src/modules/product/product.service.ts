'use client';

import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateProductDTO from './dtos/create-product.dto';
import FilterProductsDTO from './dtos/filter-products.dto';
import AddToCartDTO from './dtos/add-to-cart.dto';
import productSchema from '../../schemas/product.schema';
import SetMainImageDTO from './dtos/set-main-image.dto';
import productImageSchema from '../../schemas/product-image.schema';
import AddProductImageDTO from './dtos/add-product-image.dto';
import Paginator from '../utils/paginator';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly client: PrismaService) {}

  async create(data: CreateProductDTO) {
    const validation = productSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const {
      discount,
      name,
      subtitle,
      composition,
      price,
      sku,
      quantities,
      images,
    } = validation.data;

    if ((images ?? []).filter((i) => i.main).length > 1) {
      throw new UnprocessableEntityException(
        'Only 1 image can be the main one',
      );
    }

    const [category, gender, color, size] = await Promise.all([
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
      this.client.size.findUnique({
        where: {
          id: data.sizeId,
        },
      }),
    ]);

    if (!category) {
      throw new UnprocessableEntityException('Category not found');
    } else if (!gender) {
      throw new UnprocessableEntityException('Gender not found');
    } else if (!color) {
      throw new UnprocessableEntityException('Color not found');
    } else if (!size) {
      throw new UnprocessableEntityException('Size not found');
    }

    return await this.client.product.create({
      data: {
        discount,
        name,
        subtitle,
        composition,
        price,
        sku,
        category: {
          connect: {
            id: category.id,
          },
        },
        images: {
          createMany: {
            data: (images ?? []).map((image) => ({
              url: image.url,
              main: image.main,
            })),
          },
        },
        quantity: {
          create: {
            value: quantities,
            colorId: color.id,
            genderId: gender.id,
            sizeId: size.id,
          },
        },
      },
    });
  }

  async list({ itemsPerPage, page, ...data }: FilterProductsDTO) {
    const paginator = new Paginator(itemsPerPage, page);
    const { skip, take } = paginator;

    const where: Prisma.ProductWhereInput = {
      OR: [
        {
          name: {
            contains: data.name,
            mode: 'insensitive',
          },
        },
        {
          subtitle: {
            contains: data.name,
            mode: 'insensitive',
          },
        },
      ],
    };

    if (data.category) {
      where.category = {
        id: {
          in: data.category,
        },
      };
    }
    if (data.gender) {
      where.quantity.some = {
        gender: {
          id: {
            in: data.gender,
          },
        },
      };
    }
    if (data.color) {
      where.quantity.some = {
        ...where.quantity.some,
        color: {
          id: {
            in: data.color,
          },
        },
      };
    }
    if (data.size) {
      where.quantity.some = {
        ...where.quantity.some,
        size: {
          id: {
            in: data.size,
          },
        },
      };
    }

    const [items, total] = await Promise.all([
      this.client.product.findMany({
        where,
        include: {
          quantity: true,
          images: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take,
        skip,
      }),
      this.client.product.count({
        where,
      }),
    ]);

    return {
      items,
      ...paginator.getInfos(total),
    };
  }

  async getById(id: string, userId?: string) {
    console.log(userId);

    const product = await this.client.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
        quantity: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let favorited = undefined;

    if (userId) {
      favorited = await this.client.product.findFirst({
        where: {
          id: product.id,
          users: {
            some: {
              id: userId,
            },
          },
        },
      });
    }

    return {
      ...product,
      favorited: !!favorited,
    };
  }

  async listFavorites(userId: string) {
    const favorites = await this.client.product.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        images: true,
      },
    });

    return favorites;
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
        order: null,
      },
      include: {
        user: true,
      },
    });
  }

  async addToCart(data: AddToCartDTO, userId: string) {
    const product = await this.client.product.findUnique({
      where: {
        id: data.productId,
        quantity: {
          some: {
            sizeId: data.sizeId,
            colorId: data.colorId,
            value: {
              gte: data.quantity,
            },
          },
        },
      },
      include: {
        quantity: true,
      },
    });

    const quantityAvailable =
      product?.quantity.find(
        (i) => i.sizeId === data.sizeId && i.colorId === data.colorId,
      )?.value ?? 0;

    if (!product) {
      throw new BadRequestException('Product not found');
    } else if (quantityAvailable < data.quantity) {
      throw new BadRequestException(
        'Quantity of products available is not enough',
      );
    }

    const existsItemCart = await this.client.cart.findFirst({
      where: {
        userId,
        products: {
          some: {
            id: data.productId,
          },
        },
        order: null,
      },
      include: {
        products: {
          include: {
            quantity: true,
          },
        },
      },
    });

    if (existsItemCart) {
      let quantityId: number;

      const existsItemCartQuantity = existsItemCart.products
        .find((i) => i.id === data.productId)
        .quantity.find((i) => {
          if (i.sizeId === data.sizeId && i.colorId === data.colorId) {
            quantityId = i.id;
            return true;
          }
          return false;
        }).value;

      if (existsItemCartQuantity + data.quantity > quantityAvailable) {
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
          // todo: esse update está atualizando a quantidade do produto, mas não está atualizando o preço total do carrinho
          products: {
            update: {
              where: {
                id: data.productId,
              },
              data: {
                quantity: {
                  update: {
                    where: {
                      id: quantityId,
                    },
                    data: {
                      value: {
                        increment: data.quantity,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      const availableQuantities = product.quantity.find((i) => {
        return i.sizeId === data.sizeId;
      }).value;

      if (data.quantity > availableQuantities) {
        throw new BadRequestException({
          message: `Quantity unavailable for ${product.name} product`,
          productId: product.id,
        });
      }

      await this.client.cart.create({
        data: {
          products: {
            connect: {
              id: product.id,
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

  async addImage(data: AddProductImageDTO) {
    const validation = productImageSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const product = await this.client.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imagesCount = await this.client.productImage.count({
      where: {
        productId: product.id,
      },
    });

    return await this.client.productImage.create({
      data: {
        product: {
          connect: {
            id: product.id,
          },
        },
        url: validation.data.url,
        main: imagesCount === 0,
      },
    });
  }

  async setMainImage(data: SetMainImageDTO) {
    const image = await this.client.productImage.findUnique({
      where: {
        id: data.imageId,
        productId: data.productId,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const oldMainImage = await this.client.productImage.findFirst({
      where: {
        productId: data.productId,
        main: true,
      },
    });

    const [newMainImage] = await Promise.all([
      this.client.productImage.update({
        where: {
          id: image.id,
        },
        data: {
          main: true,
        },
      }),
      this.client.productImage.update({
        where: {
          id: oldMainImage.id,
        },
        data: {
          main: false,
        },
      }),
    ]);

    return newMainImage;
  }

  async deleteImage(imageId: string) {
    const image = await this.client.productImage.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    } else if (image.main) {
      throw new BadRequestException('The main image cannot be deleted');
    }

    await this.client.productImage.delete({
      where: {
        id: imageId,
      },
    });
  }
}
