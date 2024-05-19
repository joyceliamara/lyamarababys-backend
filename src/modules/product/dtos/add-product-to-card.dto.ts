import { ApiProperty } from '@nestjs/swagger';

export default class AddProductToCardDTO {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  colorId: string;

  @ApiProperty()
  quantity: number;
}
