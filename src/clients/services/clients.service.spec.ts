import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { Clients, TypeBusiness } from '../entities/client.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Gender } from 'src/enums/gender.enum';

describe('ClientsService', () => {
  let service: ClientsService;
  let clientRepository: Repository<Clients>;
  let ordersRepository: Repository<Orders>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Clients),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Orders),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    clientRepository = module.get<Repository<Clients>>(
      getRepositoryToken(Clients),
    );
    ordersRepository = module.get<Repository<Orders>>(
      getRepositoryToken(Orders),
    );
  });

  describe('create', () => {
    it('should create a new client', async () => {
      // Arrange
      const createDto: CreateClientDto = {
        name: 'John',
        lastname: 'Doe',
        photo: 'photo.jpg',
        email: 'john@example.com',
        type_business: TypeBusiness.B2B,
        gender: Gender.OTRO,
      };

      const createdClient = { id_client: 1, ...createDto, orders: [] };

      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(clientRepository, 'create')
        .mockReturnValue(createdClient as Clients);
      jest
        .spyOn(clientRepository, 'save')
        .mockResolvedValue(createdClient as Clients);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(createdClient);
      expect(clientRepository.create).toHaveBeenCalledWith(createDto);
      expect(clientRepository.save).toHaveBeenCalledWith(createdClient);
    });

    it('should throw BadRequestException if email is already registered', async () => {
      // Arrange
      const createDto: CreateClientDto = {
        name: 'John',
        lastname: 'Doe',
        photo: 'photo.jpg',
        email: 'john@example.com',
        type_business: TypeBusiness.B2B,
        gender: Gender.OTRO,
      };
      jest
        .spyOn(clientRepository, 'findOne')
        .mockResolvedValue({ id_client: 1, ...createDto } as Clients);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of active clients', async () => {
      // Arrange
      const clients: Clients[] = [
        {
          id_client: 1,
          name: 'John',
          status: 1,
          created_at: new Date(),
          orders: [],
        } as Clients,
      ];

      jest.spyOn(clientRepository, 'find').mockResolvedValue(clients);
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].orders).toEqual([null]);
      expect(clientRepository.find).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no clients exist', async () => {
      // Arrange
      jest.spyOn(clientRepository, 'find').mockResolvedValue([]);

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      // Arrange
      const client = { id_client: 1, name: 'John', status: 1 } as Clients;
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(client);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(client);
      expect(clientRepository.findOne).toHaveBeenCalledWith({
        where: { id_client: 1, status: 1 },
      });
    });

    it('should throw NotFoundException if client is not found', async () => {
      // Arrange
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a client by email', async () => {
      // Arrange
      const client = {
        id_client: 1,
        name: 'John',
        email: 'john@example.com',
      } as Clients;
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(client);

      // Act
      const result = await service.findByEmail('john@example.com');

      // Assert
      expect(result).toEqual(client);
      expect(clientRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should throw NotFoundException if client email is not found', async () => {
      // Arrange
      jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByEmail('unknown@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      // Arrange
      const existingClient = {
        id_client: 1,
        name: 'John',
        email: 'john@example.com',
        status: 1,
      } as Clients;
      const updateDto: UpdateClientDto = { name: 'Updated John' };

      jest
        .spyOn(clientRepository, 'findOneBy')
        .mockResolvedValue(existingClient);
      jest
        .spyOn(clientRepository, 'merge')
        .mockImplementation((obj, changes) => Object.assign(obj, changes));
      jest
        .spyOn(clientRepository, 'save')
        .mockResolvedValue({ ...existingClient, ...updateDto });

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result.name).toBe('Updated John');
      expect(clientRepository.merge).toHaveBeenCalledWith(
        existingClient,
        updateDto,
      );
      expect(clientRepository.save).toHaveBeenCalledWith(existingClient);
    });
  });

  describe('remove', () => {
    it('should mark a client as deleted (soft delete)', async () => {
      // Arrange
      const existingClient = {
        id_client: 1,
        name: 'John',
        status: 1,
      } as Clients;
      const deleteDto: UpdateClientDto = { status: 0 };

      jest
        .spyOn(clientRepository, 'findOneBy')
        .mockResolvedValue(existingClient);
      jest
        .spyOn(clientRepository, 'merge')
        .mockImplementation((obj, changes) => Object.assign(obj, changes));
      jest
        .spyOn(clientRepository, 'save')
        .mockResolvedValue({ ...existingClient, status: 0 });

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result.status).toBe(0);
      expect(clientRepository.merge).toHaveBeenCalledWith(
        existingClient,
        deleteDto,
      );
      expect(clientRepository.save).toHaveBeenCalledWith(existingClient);
    });
  });
});
