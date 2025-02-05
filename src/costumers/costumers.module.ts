import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './services/customers.service';
import { UserContextModule } from 'src/userContext/userContext.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customers]), UserContextModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CostumersModule {}
