import { ApiProperty } from '@nestjs/swagger';

class Quantity {
  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  count: number;
}

export default class CreateProductDTO {
  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  genderId: string;

  @ApiProperty()
  colorId: string;

  @ApiProperty({ type: Quantity, isArray: true })
  quantities: Quantity[];
}
