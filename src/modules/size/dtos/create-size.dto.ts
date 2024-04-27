import { ApiProperty } from '@nestjs/swagger';

export default class CreateSizeDTO {
  @ApiProperty()
  name: string;
}
