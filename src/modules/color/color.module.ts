import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { PrismaService } from '../../services/prisma.service';

@Module({
  controllers: [ColorController],
  providers: [PrismaService, ColorService],
})
export class ColorModule {}
