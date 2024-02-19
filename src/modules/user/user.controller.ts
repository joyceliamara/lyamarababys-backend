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

@Controller('user')
@ApiTags('User')
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

  @Get()
  @UseGuards(AuthGuard)
  async getSelfData(@Req() req: AuthenticatedRequest) {
    const { user } = req;

    return await this.userService.getSelfData(user.id);
  }

  @Put('contact')
  @UseGuards(AuthGuard)
  async updateContact(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateContactDTO,
  ) {
    const { user } = req;

    return await this.userService.updateContact(user.id, data);
  }

  @Get('address')
  @UseGuards(AuthGuard)
  async getAddresses(@Req() req: AuthenticatedRequest) {
    return this.userService.getAddresses(req.user.id);
  }

  @Post('address')
  @UseGuards(AuthGuard)
  async createAddress(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateAddressDTO,
  ) {
    const { user } = req;

    return await this.userService.createAddress(body, user.id);
  }

  @Put('address/:addressId')
  @UseGuards(AuthGuard)
  async updateAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateAddressDTO,
  ) {
    return await this.userService.updateAddress(addressId, req.user.id, body);
  }

  @Patch('address/:addressId/set-main')
  @UseGuards(AuthGuard)
  async setMainAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.userService.setMainAddress(addressId, req.user.id);
  }

  @Delete('address/:addressId')
  @UseGuards(AuthGuard)
  async deleteAddress(
    @Param('addressId') addressId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.userService.deleteAddress(addressId, req.user.id);
  }
}
