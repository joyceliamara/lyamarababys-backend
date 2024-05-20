import { ApiProperty } from '@nestjs/swagger';

export default class RemoveProductToCardDTO {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  colorId: string;

  @ApiProperty()
  quantity: number;
}
