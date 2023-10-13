import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDTO from './dtos/create-user.dto';
import AuthUserDTO from './dtos/auth-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }

  @Post('auth')
  async auth(@Body() body: AuthUserDTO) {
    return await this.userService.auth(body);
  }
}
