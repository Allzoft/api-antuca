import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserContextService } from './service/userContext.service';
import { Customers } from 'src/costumers/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers])], 
  exports: [UserContextService],
  providers: [UserContextService],
})
export class UserContextModule {}
