import { Module } from '@nestjs/common';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [GenderController],
  providers: [PrismaService, GenderService],
})
export class GenderModule {}
