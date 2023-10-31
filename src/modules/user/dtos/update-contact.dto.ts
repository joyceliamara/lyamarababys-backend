import { ApiProperty } from '@nestjs/swagger';

export default class UpdateContactDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  bornDate: string;
}
