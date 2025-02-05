import { Injectable } from '@nestjs/common';
import { Customers } from 'src/costumers/entities/customer.entity';

@Injectable()
export class UserContextService {
  private user: Customers

  setUser(user: Customers) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
