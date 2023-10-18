import { Controller, Post, Body, Put, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import CreateUserDTO from './dtos/create-user.dto';
import AuthUserDTO from './dtos/auth-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import UpdateRegisterDTO from './dtos/update-register.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
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

  @Put('register')
  @UseGuards(AuthGuard)
  async updateRegister(@Req() req: Request, @Body() data: UpdateRegisterDTO) {
    const user = req['user'] as { id: string; email: string };

    return await this.userService.updateRegister(user.id, data);
  }
}
