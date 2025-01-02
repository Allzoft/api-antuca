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
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,

    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const existingClient = await this.clientRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existingClient) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const newClient = this.clientRepository.create(createClientDto);
    if (newClient.password) {
      const hashPassword = await bcrypt.hash(newClient.password, 10);
      newClient.password = hashPassword;
    }

    newClient.orders = [];

    return await this.clientRepository.save(newClient);
  }

  async findAll() {
    const list = await this.clientRepository.find({
      where: { status: 1 },
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
    const item = await this.clientRepository.findOne({
      where: { id_client: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This client #${id} not found`);
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
    const item = await this.clientRepository.findOneBy({ id_client: id });
  
    if (updateClientDto.password) {
      const hashPassword = await bcrypt.hash(updateClientDto.password, 10);
      updateClientDto.password = hashPassword;
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
    const item = await this.clientRepository.findOneBy({ id_client: id });
    const deleteClient: UpdateClientDto = {
      status: 0,
    };

    this.clientRepository.merge(item, deleteClient);
    return this.clientRepository.save(item);
  }
}
