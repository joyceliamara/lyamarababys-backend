import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import CreateUserDTO from './dtos/create-user.dto';
import userSchema from 'src/schemas/user.schema';
import { compareSync, hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import AuthUserDTO from './dtos/auth-user.dto';
import UpdateRegisterDTO from './dtos/update-register.dto';
import contactSchema from 'src/schemas/contact.schema';
import addressSchema from 'src/schemas/address.schema';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const validation = userSchema.safeParse(data);

    if (validation.success === false) {
      throw new UnprocessableEntityException(validation.error.issues);
    }

    const { name, email, password } = validation.data;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new UnprocessableEntityException('User already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
      select: {
        email: true,
        id: true,
        name: true,
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
        name: true,
        password: true,
        createdAt: false,
        updatedAt: false,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    } else if (!compareSync(data.password, user.password)) {
      throw new BadRequestException('Invalid password');
    }

    delete user.password;

    return {
      user,
      token: sign({ id: user.id, email: user.email }, process.env.JWT_KEY),
    };
  }

  async updateRegister(userId: string, data: UpdateRegisterDTO) {
    const contactValidation = contactSchema.safeParse(data.contact);
    const addressValidation = addressSchema.safeParse(data.address);

    if (contactValidation.success === false) {
      throw new UnprocessableEntityException(contactValidation.error.issues);
    } else if (addressValidation.success === false) {
      throw new UnprocessableEntityException(addressValidation.error.issues);
    }

    const [contact, address] = await Promise.all([
      this.prisma.contact.findFirst({
        where: {
          user: {
            some: {
              id: userId,
            },
          },
        },
      }),
      this.prisma.address.findFirst({
        where: {
          userId,
        },
      }),
    ]);

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        contact: {
          ...(contact
            ? {
                update: {
                  where: {
                    id: contact.id,
                  },
                  data: {
                    ...contactValidation.data,
                  },
                },
              }
            : {
                create: {
                  ...contactValidation.data,
                },
              }),
        },
        addresses: {
          updateMany: {
            where: {
              userId,
            },
            data: {
              ...addressValidation.data,
            },
          },
        },
      },
    });
  }
}
