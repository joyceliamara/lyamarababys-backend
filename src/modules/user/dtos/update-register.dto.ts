import { ApiProperty } from '@nestjs/swagger';

class Contact {
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

class Address {
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

export default class UpdateRegisterDTO {
  @ApiProperty()
  contact: Contact;

  @ApiProperty()
  address: Address;
}
