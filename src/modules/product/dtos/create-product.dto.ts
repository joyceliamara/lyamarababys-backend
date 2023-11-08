import { ApiProperty } from '@nestjs/swagger';

class Quantity {
  @ApiProperty()
  sizeId: string;

  @ApiProperty()
  count: number;
}

class Image {
  @ApiProperty()
  url: string;

  @ApiProperty()
  main: boolean;
}

export default class CreateProductDTO {
  @ApiProperty()
  sku: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subtitle: string;

  @ApiProperty()
  composition: string;

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

  @ApiProperty({ type: Image, isArray: true })
  images: Image[];
}
