import { ApiProperty } from '@nestjs/swagger';

export default class FilterProductsDTO {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  category?: string[];

  @ApiProperty({ required: false })
  gender?: string[];

  @ApiProperty({ required: false })
  size?: string[];

  @ApiProperty({ required: false })
  color?: string[];
}
