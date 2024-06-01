import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import CreateProductDTO from './dtos/create-product.dto';
import { createProductSchema } from './schemas/create-product.schema';
import { updateProductSchema } from './schemas/update-product.schema';
import UpdateProductDTO from './dtos/update-product.dto';
import { PrismaService } from '../../services/prisma.service';
import AddProductToCardDTO from './dtos/add-product-to-card.dto';
import RemoveProductToCardDTO from './dtos/remove-product-to-card.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDTO) {
    const validation = createProductSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.message);
    }

    data = validation.data as CreateProductDTO;

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

  async findOne(idOrPath: string, userId?: string) {
    const product = await this.prisma.product.findFirst({
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
      include: {
        images: true,
        category: true,
        gender: true,
        quantities: {
          include: {
            size: true,
            color: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let favorited = false;

    if (userId) {
      const user = await this.prisma.product.findFirst({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      });

      favorited = !!user;
    }

    return {
      ...product,
      favorited,
    };
  }

  async getFavorite(userId: string) {
    return await this.prisma.product.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        images: true,
        category: true,
        gender: true,
      },
    });
  }

  async update(data: UpdateProductDTO) {
    const validation = updateProductSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.message);
    }

    data = validation.data as UpdateProductDTO;

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
        id: data.id,
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

  async favorite(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          connect: {
            id: productId,
          },
        },
      },
    });
  }

  async unfavorite(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id: productId,
          },
        },
      },
    });
  }

  async addToCart(data: AddProductToCardDTO, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: data.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = await this.prisma.quantity.findFirst({
      where: {
        productId: data.productId,
        sizeId: data.sizeId,
        colorId: data.colorId,
      },
    });

    if (!quantity) {
      throw new NotFoundException('Quantity not found');
    }

    if (quantity.units < data.quantity) {
      throw new ConflictException('Quantity not available');
    }

    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        product: true,
        size: true,
        color: true,
      },
    });

    if (
      cart &&
      cart.productId === data.productId &&
      cart.sizeId === data.sizeId &&
      cart.colorId === data.colorId
    ) {
      await this.prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          quantity: cart.quantity + data.quantity,
        },
      });

      return;
    }

    await this.prisma.cart.create({
      data: {
        quantity: data.quantity,
        userId,
        productId: data.productId,
        sizeId: data.sizeId,
        colorId: data.colorId,
      },
    });
  }

  async removeFromCart(data: RemoveProductToCardDTO, userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (
      !(
        cart.productId === data.productId &&
        cart.sizeId === data.sizeId &&
        cart.colorId === data.colorId
      )
    ) {
      throw new NotFoundException('Product not found in cart');
    }

    if (cart.quantity === data.quantity || data.quantity < 0) {
      await this.prisma.cart.delete({
        where: {
          id: cart.id,
        },
      });

      return;
    }

    await this.prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        quantity: cart.quantity - data.quantity,
      },
    });
  }

  async getCart(userId: string) {
    return await this.prisma.cart.findMany({
      where: {
        userId,
        orderId: null,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        size: true,
        color: true,
      },
    });
  }
}
