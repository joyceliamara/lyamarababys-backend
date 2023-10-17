import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export default class UpdateOrderStatusDTO {
  @ApiProperty()
  status: Status;
}
