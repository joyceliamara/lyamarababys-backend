import { ApiProperty } from '@nestjs/swagger';

export default class CreateColorDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
