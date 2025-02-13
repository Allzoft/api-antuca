import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { ClientsService } from 'src/clients/services/clients.service';
import { CustomersService } from 'src/costumers/services/customers.service';
import { Customers } from 'src/costumers/entities/customer.entity';
import { PayloadToken } from '../models/token.model';
import { UserContextService } from 'src/userContext/service/userContext.service';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private clientsService: ClientsService,
    private customerService: CustomersService,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private userContextService: UserContextService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.customerService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async getUserLogById(idUser) {
    const user = await this.customerService.findOne(idUser);
    this.userContextService.setUser(user);
    return user;
  }

  generateJWT(customer: Customers) {
    const payload: PayloadToken = {
      id: customer.id_customer,
      email: customer.email,
      restaurantIdRestaurant: customer.restaurantIdRestaurant,
    };
    return {
      access_token: this.jwtService.sign(payload),
      customer,
    };
  }

  decodeUser(token) {
    return this.jwtService.decode(token);
  }
}
