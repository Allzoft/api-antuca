import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './services/customers.service';
import { UserContextModule } from 'src/userContext/userContext.module';
import { Role } from './entities/role.entity';
import { Access } from './entities/access.entity';
import { RoleController } from './roles.controller';
import { AccessController } from './accesses.controller';
import { RoleService } from './services/roles.service';
import { AccessService } from './services/access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customers, Role, Access]),
    UserContextModule,
  ],
  controllers: [CustomersController, RoleController, AccessController],
  providers: [CustomersService, RoleService, AccessService],
  exports: [CustomersService],
})
export class CostumersModule {}
