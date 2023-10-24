import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
