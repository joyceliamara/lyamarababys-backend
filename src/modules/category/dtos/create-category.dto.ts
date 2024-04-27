import { ApiProperty } from '@nestjs/swagger';

export default class CreateCategoryDTO {
  @ApiProperty()
  name: string;
}
