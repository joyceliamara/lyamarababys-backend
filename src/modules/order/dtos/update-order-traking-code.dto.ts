import { ApiProperty } from '@nestjs/swagger';

export default class UpdateOrderTrackingCodeDTO {
  @ApiProperty()
  trackingCode: string;
}
