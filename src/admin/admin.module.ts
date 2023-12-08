import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { States } from './entities/state.entity';
import { StatesController } from './states.controller';
import { StatesService } from './services/states.service';

@Module({
  imports: [TypeOrmModule.forFeature([States])],
  controllers: [StatesController],
  providers: [StatesService],
})
export class AdminModule {}
