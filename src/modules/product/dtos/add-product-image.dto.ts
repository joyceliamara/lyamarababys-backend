import { ApiProperty } from '@nestjs/swagger';

export default class AddProductImageDTO {
  @ApiProperty()
  url: string;

  @ApiProperty()
  productId: string;
}
