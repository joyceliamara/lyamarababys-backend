import { ApiProperty } from '@nestjs/swagger';

export default class UpdateGenderDTO {
  @ApiProperty()
  name: string;
}
