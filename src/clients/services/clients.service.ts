import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateClientDto } from './../dto/create-client.dto';
import { UpdateClientDto } from './../dto/update-client.dto';

import { Clients } from './../entities/client.entity';

import * as bcrypt from 'bcrypt';
import { Orders } from 'src/orders/entities/order.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,

    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,

    private userContextService: UserContextService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const newClient = this.clientRepository.create(createClientDto);

    newClient.restaurantIdRestaurant = restaurantId;

    newClient.orders = [];

    return await this.clientRepository.save(newClient);
  }

  async findAll() {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const list = await this.clientRepository.find({
      where: { status: 1, restaurantIdRestaurant: restaurantId },
      order: { created_at: 'DESC' },
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    const listWithLastOrder = await Promise.all(
      list.map(async (client) => {
        client.orders = [];
        const lastOrder = await this.ordersRepository.findOne({
          where: { clientIdClient: client.id_client },
          order: { date: 'DESC' },
        });
        return { ...client, orders: [lastOrder] };
      }),
    );

    return listWithLastOrder;
  }

  async findOne(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.clientRepository.findOne({
      where: { id_client: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This client #${id} not found`);
    }
    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new BadRequestException('El cliente no pertenece a su restaurante');
    }

    return item;
  }

  async findByEmail(email: string) {
    const client = await this.clientRepository.findOne({
      where: { email: email },
    });

    if (client) {
      return client;
    } else {
      throw new NotFoundException(
        `this client with mail: ${email} it has not been found`,
      );
    }
  }
  async update(id: number, updateClientDto: UpdateClientDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.clientRepository.findOneBy({ id_client: id });

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new BadRequestException('El cliente no pertenece a su restaurante');
    }

    this.clientRepository.merge(item, updateClientDto);

    let savedClient = await this.clientRepository.save(item);

    savedClient.orders = [];
    const lastOrder = await this.ordersRepository.findOne({
      where: { clientIdClient: savedClient.id_client },
      order: { date: 'DESC' },
    });
    savedClient = { ...savedClient, orders: [lastOrder] };

    return savedClient;
  }

  async remove(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.clientRepository.findOneBy({ id_client: id });

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new BadRequestException('El cliente no pertenece a su restaurante');
    }
    const deleteClient: UpdateClientDto = {
      status: 0,
    };

    this.clientRepository.merge(item, deleteClient);
    return this.clientRepository.save(item);
  }
}
