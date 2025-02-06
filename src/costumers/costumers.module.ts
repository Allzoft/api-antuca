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
import { RestaurantsController } from './restaurant.controller';
import { RestaurantsService } from './services/restaurants.service';
import { Restaurants } from './entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customers, Role, Access, Restaurants]),
    UserContextModule,
  ],
  controllers: [
    CustomersController,
    RoleController,
    AccessController,
    RestaurantsController,
  ],
  providers: [CustomersService, RoleService, AccessService, RestaurantsService],
  exports: [CustomersService],
})
export class CostumersModule {}
