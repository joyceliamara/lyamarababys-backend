import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProductDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  genderId: string;
}
