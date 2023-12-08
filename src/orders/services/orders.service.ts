import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../entities/order.entity';
import { Repository, Between } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Clients } from 'src/clients/entities/client.entity';
import { Customers } from 'src/costumers/entities/customer.entity';
import { PaymentType } from 'src/admin/entities/paymentType.entity';
import { States } from 'src/admin/entities/state.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,

    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,

    @InjectRepository(Customers)
    private customerRepository: Repository<Customers>,

    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,

    @InjectRepository(States)
    private stateRepository: Repository<States>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);

    if (createOrderDto.clientIdClient) {
      const client = await this.clientRepository.findOne({
        where: { id_client: createOrderDto.clientIdClient },
      });
      newOrder.client = client;
    }

    if (createOrderDto.customerIdCustomer) {
      const customer = await this.customerRepository.findOne({
        where: { id_customer: createOrderDto.customerIdCustomer },
      });
      newOrder.customer = customer;
    }

    if (createOrderDto.paymentTypeIdPaymentType) {
      const paymentType = await this.paymentTypeRepository.findOne({
        where: { id_payment_type: createOrderDto.paymentTypeIdPaymentType },
      });
      newOrder.paymentType = paymentType;
    }

    if (createOrderDto.stateIdState) {
      const state = await this.stateRepository.findOne({
        where: { id_state: createOrderDto.stateIdState },
      });
      newOrder.state = state;
    }

    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    const list = await this.orderRepository.find({
      relations: ['client', 'customer', 'state', 'paymentType'],
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id_order: id, status: 1 },
      relations: ['client', 'customer', 'state', 'paymentType'],
    });
    if (!order) {
      throw new NotFoundException(`This order #${id} not found`);
    }
    return order;
  }

  async findAllByClient(id: number, limit: number, offset: number) {
    const list = await this.orderRepository.find({
      relations: ['client', 'customer', 'state', 'paymentType'],
      where: { clientIdClient: id, status: 1 },
      take: limit,
      skip: offset,
      order: {
        id_order: 'DESC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findAllByDates(datestart: Date, dateend: Date) {
    datestart = new Date(datestart);
    datestart.setHours(0, 0, 0, 0);
    dateend = new Date(dateend);
    dateend.setHours(23, 59, 59, 999);
    const list = await this.orderRepository.find({
      relations: ['client', 'customer', 'state', 'paymentType'],
      where: {
        date: Between(datestart, dateend),
        status: 1,
      },
      order: {
        date: 'DESC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id_order: id });
    if (!order) {
      throw new NotFoundException(`This order #${id} not found`);
    }

    if (updateOrderDto.clientIdClient) {
      const client = await this.clientRepository.findOne({
        where: { id_client: updateOrderDto.clientIdClient },
      });
      order.client = client;
    }

    if (updateOrderDto.customerIdCustomer) {
      const customer = await this.customerRepository.findOne({
        where: { id_customer: updateOrderDto.customerIdCustomer },
      });
      order.customer = customer;
    }

    if (updateOrderDto.paymentTypeIdPaymentType) {
      const paymentType = await this.paymentTypeRepository.findOne({
        where: { id_payment_type: updateOrderDto.paymentTypeIdPaymentType },
      });
      order.paymentType = paymentType;
    }

    if (updateOrderDto.stateIdState) {
      const state = await this.stateRepository.findOne({
        where: { id_state: updateOrderDto.stateIdState },
      });
      order.state = state;
    }

    this.orderRepository.merge(order, updateOrderDto);

    return await this.orderRepository.save(order);
  }

  async remove(id: number) {
    const item = await this.orderRepository.findOneBy({ id_order: id });
    const deleteOrder: UpdateOrderDto = {
      status: 0,
    };

    this.orderRepository.merge(item, deleteOrder);

    return this.orderRepository.save(item);
  }
}
