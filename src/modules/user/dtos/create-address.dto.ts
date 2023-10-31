import { ApiProperty } from '@nestjs/swagger';

export default class CreateAddressDTO {
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
