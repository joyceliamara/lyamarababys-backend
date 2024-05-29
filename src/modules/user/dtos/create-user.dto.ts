import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
