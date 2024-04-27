import { Module } from '@nestjs/common';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';

@Module({
  controllers: [GenderController],
  providers: [GenderService]
})
export class GenderModule {}
