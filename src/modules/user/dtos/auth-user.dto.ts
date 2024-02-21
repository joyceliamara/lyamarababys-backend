import { ApiProperty } from '@nestjs/swagger';

export default class AuthUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  remember: string;
}
