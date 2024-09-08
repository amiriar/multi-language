import { Module } from '@nestjs/common';
import { CatrgoriesService } from './catrgories.service';
import { CatrgoriesController } from './catrgories.controller';

@Module({
  controllers: [CatrgoriesController],
  providers: [CatrgoriesService],
})
export class CatrgoriesModule {}
