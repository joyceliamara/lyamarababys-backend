import { ApiProperty } from '@nestjs/swagger';

export default class UpdateSizeDTO {
  @ApiProperty()
  name: string;
}
