import { ApiProperty } from '@nestjs/swagger';

export default class PaginationDTO {
  @ApiProperty({ default: 10 })
  itemsPerPage: number;

  @ApiProperty({ default: 1 })
  page: number;
}
