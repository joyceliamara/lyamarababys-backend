import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
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

    for (const product of products) {
      const item = items.find((i) => i.productId === product.id);
      const quantities = product.quantities.find(
        (i) => i.sizeId === item.sizeId,
      ).count;

      if (item.quantity > quantities) {
        throw new BadRequestException(
          `Quantity unavailable for ${item.product.name} product`,
        );
      }

      // todo: remover a quantidade de itens que foram comprados da tabela quantity
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
