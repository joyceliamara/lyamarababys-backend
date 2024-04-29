import { Module } from '@nestjs/common';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [SizeController],
  providers: [SizeService, PrismaService],
})
export class SizeModule {}
