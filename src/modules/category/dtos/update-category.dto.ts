import { ApiProperty } from '@nestjs/swagger';

export default class UpdateCategoryDTO {
  @ApiProperty()
  name: string;
}
