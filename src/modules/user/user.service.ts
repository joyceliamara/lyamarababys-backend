import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import CreateUserDTO from './dtos/create-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import AuthUserDTO from './dtos/auth-user.dto';
import UpdateRegisterDTO from './dtos/update-contact.dto';
import userSchema from '../../schemas/user.schema';
import contactSchema from '../../schemas/contact.schema';
import CreateAddressDTO from './dtos/create-address.dto';
import addressSchema from '../../schemas/address.schema';
import UpdateAddressDTO from './dtos/update-address.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const validation = userSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const { email, password } = validation.data;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new UnprocessableEntityException({
        message: 'User already exists',
        path: ['email'],
        statusCode: 422,
      });
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashSync(password, 10),
      },
      select: {
        email: true,
        id: true,
        password: false,
        createdAt: false,
        updatedAt: false,
      },
    });

    return {
      user: newUser,
      token: sign({ id: newUser.id, email }, process.env.JWT_KEY),
    };
  }

  async auth(data: AuthUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        email: true,
        id: true,
        password: true,
        createdAt: false,
        updatedAt: false,
      },
    });

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
        path: ['email'],
      });
    } else if (!compareSync(data.password, user.password)) {
      throw new BadRequestException({
        message: 'Invalid password',
        path: ['password'],
      });
    }

    delete user.password;

    return {
      user,
      token: sign({ id: user.id, email: user.email }, process.env.JWT_KEY),
    };
  }

  async updateContact(userId: string, data: UpdateRegisterDTO) {
    const validation = contactSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        contact: {
          upsert: {
            where: {
              userId,
            },
            create: {
              ...(validation.data as any),
            },
            update: {
              ...validation.data,
            },
          },
        },
      },
      select: {
        address: false,
        cart: false,
        contact: {
          select: {
            bornDate: true,
            cpf: true,
            createdAt: false,
            id: false,
            name: true,
            surname: true,
            phone: true,
            updatedAt: false,
            user: false,
            userId: false,
          },
        },
        createdAt: false,
        email: false,
        favorites: false,
        id: false,
        order: false,
        password: false,
        role: false,
        updatedAt: false,
      },
    });
  }

  async getAddresses(userId: string) {
    return await this.prisma.address.findMany({
      where: {
        userId,
      },
    });
  }

  async createAddress(data: CreateAddressDTO, userId: string) {
    const validation = addressSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    return await this.prisma.address.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ...(validation.data as any),
      },
    });
  }

  async updateAddress(
    addressId: string,
    userId: string,
    data: UpdateAddressDTO,
  ) {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new BadRequestException('Address not found');
    }

    const validation = addressSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    return await this.prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        ...(validation.data as any),
      },
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new BadRequestException('Address not found');
    }

    await this.prisma.address.delete({
      where: {
        id: addressId,
      },
    });
  }
}
