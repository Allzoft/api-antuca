import { Test, TestingModule } from '@nestjs/testing';
import { StatesController } from './states.controller';
import { StatesService } from './services/states.service';
import { CreateStatesDto } from './dto/create-state.dto';
import { UpdateStatesDto } from './dto/update-state.dto';
import { StateType, States } from './entities/state.entity';
import { NotFoundException } from '@nestjs/common';

describe('StatesController', () => {
  let controller: StatesController;
  let service: StatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatesController],
      providers: [
        {
          provide: StatesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByType: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatesController>(StatesController);
    service = module.get<StatesService>(StatesService);
  });

  describe('create', () => {
    it('should create a new state', async () => {
      const createDto: CreateStatesDto = {
        id_state: 1,
        name: 'Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      };
      const createdState = { id_state: 1, ...createDto };
      jest.spyOn(service, 'create').mockResolvedValue(createdState as States);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdState);
      expect(service.create).toHaveBeenCalledWith(createDto);
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
      jest.spyOn(service, 'findAll').mockResolvedValue(states);

      const result = await controller.findAll();

      expect(result).toEqual(states);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no states are found', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(new NotFoundException());

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByType', () => {
    it('should return a list of states filtered by type', async () => {
      const states: States[] = [
        {
          id_state: 1,
          name: 'Pending',
          type: StateType.ORDER_STATUS,
          priority: 1,
          status: 1,
        } as States,
      ];
      jest.spyOn(service, 'findAllByType').mockResolvedValue(states);

      const result = await controller.findAllByType(StateType.ORDER_STATUS);

      expect(result).toEqual(states);
      expect(service.findAllByType).toHaveBeenCalledWith(
        StateType.ORDER_STATUS,
      );
    });

    it('should throw NotFoundException if no states are found', async () => {
      jest
        .spyOn(service, 'findAllByType')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.findAllByType(StateType.ORDER_STATUS),
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
      jest.spyOn(service, 'findOne').mockResolvedValue(state);

      const result = await controller.findOne('1');

      expect(result).toEqual(state);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if state is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing state', async () => {
      const updateDto: UpdateStatesDto = { name: 'Updated Pending' };
      const updatedState = {
        id_state: 1,
        name: 'Updated Pending',
        type: StateType.ORDER_STATUS,
        priority: 1,
        status: 1,
      } as States;
      jest.spyOn(service, 'update').mockResolvedValue(updatedState);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedState);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a state', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toEqual({
        message: 'State with id: 1 deleted successfully',
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
