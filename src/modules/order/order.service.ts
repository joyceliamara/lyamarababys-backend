import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import UpdateOrderStatusDTO from './dtos/update-order-status.dto';
import { Status } from '@prisma/client';
import UpdateOrderTrackingCodeDTO from './dtos/update-order-traking-code.dto';

@Injectable()
export class OrderService {
  constructor(private readonly client: PrismaService) {}

  async create(userId: string) {
    const items = await this.client.cart.findMany({
      where: {
        userId: userId,
        orderId: null,
      },
      include: {
        product: true,
        size: true,
      },
    });

    if (!items.length) {
      throw new BadRequestException('The cart is empty.');
    }

    const productIds = items.map((i) => i.productId);

    const products = await this.client.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        quantities: true,
      },
    });

    const quantitiesToUpdate: QuantitiesToUpdate[] = [];

    interface QuantitiesToUpdate {
      productId: string;
      sizeId: string;
      quantity: number;
    }

    for (const product of products) {
      const item = items.find((i) => i.productId === product.id);
      const quantities = product.quantities.find(
        (i) => i.sizeId === item.sizeId,
      ).count;

      if (item.quantity > quantities) {
        throw new BadRequestException({
          message: `Quantity unavailable for ${item.product.name} product`,
          productId: item.id,
        });
      }

      quantitiesToUpdate.push({
        productId: product.id,
        sizeId: item.sizeId,
        quantity: quantities,
      });
      // todo: colorId influencia na quantidade?
    }

    const total = items.reduce((prev, act) => {
      const val = act.product.price * act.quantity;

      return prev + val;
    }, 0);
    const discount = items.reduce((prev, act) => {
      const val = act.product.discount * act.quantity;

      return prev + val;
    }, 0);

    const order = await this.client.order.create({
      data: {
        total: total,
        discount: discount,
        userId: userId,
      },
    });

    await this.client.cart.updateMany({
      where: {
        userId: userId,
        orderId: null,
      },
      data: {
        orderId: order.id,
      },
    });

    await Promise.all(
      quantitiesToUpdate.map((i) => {
        return this.client.quantity.updateMany({
          where: {
            productId: i.productId,
            sizeId: i.sizeId,
          },
          data: {
            count: {
              decrement: i.quantity,
            },
          },
        });
      }),
    );

    return order;
  }

  async updateStatus(orderId: string, data: UpdateOrderStatusDTO) {
    if (!Status[data.status]) {
      throw new UnprocessableEntityException('Status is not valid');
    }

    const order = await this.client.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return await this.client.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: data.status,
      },
    });
  }

  async updateTrackingCode(orderId: string, data: UpdateOrderTrackingCodeDTO) {
    const order = await this.client.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return await this.client.order.update({
      where: {
        id: orderId,
      },
      data: {
        trackingCode: data.trackingCode,
      },
    });
  }
}
