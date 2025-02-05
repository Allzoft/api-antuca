import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './../dto/create-item.dto';
import { UpdateItemDto } from './../dto/update-item.dto';

import { Items } from './../entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items)
    private itemRepository: Repository<Items>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const newItem = this.itemRepository.create(createItemDto);

    return await this.itemRepository.save(newItem);
  }

  async findAll() {
    const list = await this.itemRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }

    list.forEach((e) => {
      e.dailyAvailabilities = [];
    });

    return list;
  }
  

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id_item: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This item #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.findOneBy({ id_item: id });

    this.itemRepository.merge(item, updateItemDto);

    return this.itemRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.itemRepository.findOneBy({ id_item: id });
    const deleteItem: UpdateItemDto = {
      status: 0,
    };

    this.itemRepository.merge(item, deleteItem);
    return this.itemRepository.save(item);
  }
}
