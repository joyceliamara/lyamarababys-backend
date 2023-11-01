import { ApiProperty } from '@nestjs/swagger';

export default class SetMainImageDTO {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  imageId: string;
}
