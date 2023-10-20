import {
  Controller,
  Post,
  Put,
  Req,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import UpdateOrderStatusDTO from './dtos/update-order-status.dto';
import UpdateOrderTrackingCodeDTO from './dtos/update-order-traking-code.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req: Request) {
    const user = req['user'] as { id: string; email: string };

    return await this.orderService.create(user.id);
  }

  @Put('status/:orderId')
  @UseGuards(AdminGuard)
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderStatusDTO,
  ) {
    return await this.orderService.updateStatus(orderId, body);
  }

  @Put('tracking-code/:orderId')
  @UseGuards(AdminGuard)
  async updateTrackingCode(
    @Param('orderId') orderId: string,
    @Body() body: UpdateOrderTrackingCodeDTO,
  ) {
    return await this.orderService.updateTrackingCode(orderId, body);
  }
}
