import { ApiProperty } from '@nestjs/swagger';

export default class AddToCartDTO {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  colorId: string;

  @ApiProperty()
  quantity: number;
}
