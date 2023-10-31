import { ApiProperty } from '@nestjs/swagger';

export default class UpdateAddressDTO {
  @ApiProperty()
  cep: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  complement: string;

  @ApiProperty()
  neighborhood: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;
}
