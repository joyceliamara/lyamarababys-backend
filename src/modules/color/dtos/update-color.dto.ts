import { ApiProperty } from '@nestjs/swagger';

export default class UpdateColorDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
