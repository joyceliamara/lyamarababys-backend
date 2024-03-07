import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDTO from './dtos/create-user.dto';
import AuthUserDTO from './dtos/auth-user.dto';
import UpdateContactDTO from './dtos/update-contact.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import CreateAddressDTO from './dtos/create-address.dto';
import AuthenticatedRequest from '../../interfaces/authenticated-request';
import UpdateAddressDTO from './dtos/update-address.dto';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() body: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userService.create(body);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 604800000), // 7 days
    });

    return result.user;
  }

  @Post('auth')
  async auth(
    @Body() body: AuthUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.userService.auth(body);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    if (body.remember) {
      cookieOptions['expires'] = new Date(Date.now() + 604800000); // 7 days
    }

    res.cookie('token', result.token, cookieOptions);

    return result.user;
  }

  @Get('self')
  @UseGuards(AuthGuard)
  async getSelfData(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return await this.userService.getSelfData(user['sub']);
  }

  @Put('contact')
  @UseGuards(AuthGuard)
  async updateContact(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateContactDTO,
  ) {
    const { user } = req;

    return await this.userService.updateContact(user['sub'], data);
  }

  @Get('address')
  @UseGuards(AuthGuard)
  async getAddresses(@Req() req: AuthenticatedRequest) {
    return this.userService.getAddresses(req.user['sub']);
  }

  @Post('address')
  @UseGuards(AuthGuard)
  async createAddress(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateAddressDTO,
  ) {
    const { user } = req;

    return await this.userService.createAddress(body, user['sub']);
  }

  @Put('address/:addressId')
  @UseGuards(AuthGuard)
  async updateAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateAddressDTO,
  ) {
    return await this.userService.updateAddress(
      addressId,
      req.user['sub'],
      body,
    );
  }

  @Patch('address/:addressId/set-main')
  @UseGuards(AuthGuard)
  async setMainAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.userService.setMainAddress(addressId, req.user['sub']);
  }

  @Delete('address/:addressId')
  @UseGuards(AuthGuard)
  async deleteAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.userService.deleteAddress(addressId, req.user['sub']);
  }
}
