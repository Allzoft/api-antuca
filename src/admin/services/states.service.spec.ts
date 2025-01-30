import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatesService } from './states.service';
import { States, StateType } from '../entities/state.entity';
import { CreateStatesDto } from '../dto/create-state.dto';
import { UpdateStatesDto } from '../dto/update-state.dto';
import { NotFoundException } from '@nestjs/common';

describe('StatesService', () => {
  let service: StatesService;
  let repository: Repository<States>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: getRepositoryToken(States),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<StatesService>(StatesService);
    repository = module.get<Repository<States>>(getRepositoryToken(States));
  });

  describe('create', () => {
    it('should create and save a state', async () => {
      const createDto: CreateStatesDto = {
        id_state: 1,
        name: 'Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      };

      const newState = { id_state: 1, ...createDto };

      jest.spyOn(repository, 'create').mockReturnValue(newState as States);
      jest.spyOn(repository, 'save').mockResolvedValue(newState as States);

      const result = await service.create(createDto);

      expect(result).toEqual(newState);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(newState);
    });
  });

  describe('findAll', () => {
    it('should return a list of states', async () => {
      const states: States[] = [
        {
          id_state: 1,
          name: 'Pending',
          type: StateType.ORDER_STATUS,
          priority: 1,
          status: 1,
        } as States,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(states);

      const result = await service.findAll();

      expect(result).toEqual(states);
      expect(repository.find).toHaveBeenCalledWith({ where: { status: 1 } });
    });

    it('should throw NotFoundException if the list is empty', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByType', () => {
    it('should return a list of states by type', async () => {
      const states: States[] = [
        {
          id_state: 1,
          name: 'Pending',
          type: StateType.ORDER_STATUS,
          priority: 1,
          status: 1,
        } as States,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(states);

      const result = await service.findAllByType(StateType.ORDER_STATUS);

      expect(result).toEqual(states);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: StateType.ORDER_STATUS, status: 1 },
        order: { priority: 'ASC' },
      });
    });

    it('should throw NotFoundException if no states are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(
        service.findAllByType(StateType.ORDER_STATUS),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a state by id', async () => {
      const state: States = {
        id_state: 1,
        name: 'Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      } as States;

      jest.spyOn(repository, 'findOne').mockResolvedValue(state);

      const result = await service.findOne(1);

      expect(result).toEqual(state);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id_state: 1, status: 1 },
      });
    });

    it('should throw NotFoundException if state is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing state', async () => {
      const existingState: States = {
        id_state: 1,
        name: 'Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      } as States;
      const updateDto: UpdateStatesDto = { name: 'Updated Pending' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingState);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((obj, changes) => Object.assign(obj, changes));
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...existingState, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('Updated Pending');
      expect(repository.merge).toHaveBeenCalledWith(existingState, updateDto);
      expect(repository.save).toHaveBeenCalledWith(existingState);
    });
  });

  describe('remove', () => {
    it('should mark a state as deleted', async () => {
      const existingState: States = {
        id_state: 1,
        name: 'Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      } as States;
      const deleteDto: UpdateStatesDto = { status: 0 };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingState);
      jest
        .spyOn(repository, 'merge')
        .mockImplementation((obj, changes) => Object.assign(obj, changes));
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...existingState, status: 0 });

      const result = await service.remove(1);

      expect(result.status).toBe(0);
      expect(repository.merge).toHaveBeenCalledWith(existingState, deleteDto);
      expect(repository.save).toHaveBeenCalledWith(existingState);
    });
  });
});
