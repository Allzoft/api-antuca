import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomerDto } from './../dto/create-customer.dto';
import { UpdateCustomerDto } from './../dto/update-customer.dto';

import { Customers } from './../entities/customer.entity';

import * as bcrypt from 'bcrypt';
import { UserContextService } from 'src/userContext/service/userContext.service';
@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers)
    private customerRepository: Repository<Customers>,

    private userContextService: UserContextService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const newCustomer = this.customerRepository.create(createCustomerDto);
    if (newCustomer.password) {
      const hashPassword = await bcrypt.hash(newCustomer.password, 10);
      newCustomer.password = hashPassword;
    }

    return await this.customerRepository.save(newCustomer);
  }

  async findAll() {
    const list = await this.customerRepository.find({
      where: { status: 1 },
      relations: { restaurant: true, role: true },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.customerRepository.findOne({
      where: { id_customer: id, status: 1 },
      relations: { restaurant: true },
    });
    if (!item) {
      throw new NotFoundException(`This customer #${id} not found`);
    }

    return item;
  }

  async findByEmail(email: string) {
    const customer = await this.customerRepository.findOne({
      where: { email: email },
      relations: { role: { access: true }, restaurant: true },
    });

    if (customer) {
      return customer;
    } else {
      throw new NotFoundException(
        `this customer with mail: ${email} it has not been found`,
      );
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.customerRepository.findOneBy({ id_customer: id });

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new BadRequestException(
        `This customer #${id} not belong to your restaurant`,
      );
    }

    if (updateCustomerDto.password) {
      const hashPassword = await bcrypt.hash(updateCustomerDto.password, 10);
      updateCustomerDto.password = hashPassword;
    }
    this.customerRepository.merge(item, updateCustomerDto);

    return this.customerRepository.save(item);
  }

  async remove(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.customerRepository.findOneBy({ id_customer: id });

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new BadRequestException(
        `This customer #${id} not belong to your restaurant`,
      );
    }

    const deleteCustomer: UpdateCustomerDto = {
      status: 0,
    };

    this.customerRepository.merge(item, deleteCustomer);
    return this.customerRepository.save(item);
  }
}
