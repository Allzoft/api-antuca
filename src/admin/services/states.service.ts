import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatesDto } from '../dto/create-state.dto';
import { UpdateStatesDto } from '../dto/update-state.dto';
import { States, StateType } from '../entities/state.entity';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(States)
    public statusRepository: Repository<States>,
  ) {}

  create(createStatesDto: CreateStatesDto) {
    const newState = this.statusRepository.create(createStatesDto);
    return this.statusRepository.save(newState);
  }

  async findAll() {
    const list = await this.statusRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllByType(type: StateType) {
    const list = await this.statusRepository.find({
      where: { type: type, status: 1 },
      order: {
        priority: 'ASC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.statusRepository.findOne({
      where: { id_state: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This state #${id} not found`);
    }
    return item;
  }

  async update(id: number, changes: UpdateStatesDto) {
    const item = await this.statusRepository.findOneBy({
      id_state: id,
      status: 1,
    });
    this.statusRepository.merge(item, changes);

    return this.statusRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.statusRepository.findOneBy({ id_state: id });
    const deleteStates: UpdateStatesDto = {
      status: 0,
    };

    this.statusRepository.merge(item, deleteStates);

    return this.statusRepository.save(item);
  }
}
