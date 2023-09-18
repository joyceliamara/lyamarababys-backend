import { ApiProperty } from '@nestjs/swagger';

export default class CreateGenderDTO {
  @ApiProperty()
  name: string;
}
