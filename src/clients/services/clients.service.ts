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
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,
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

    return await this.clientRepository.save(newClient);
  }

  async findAll() {
    const list = await this.clientRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
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

    return this.clientRepository.save(item);
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
