import { ApiProperty } from '@nestjs/swagger';
import PaginationDTO from '../../../shared/dtos/pagination.dto';

export default class FilterProductsDTO extends PaginationDTO {
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
