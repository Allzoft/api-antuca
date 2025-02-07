import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './../dto/create-item.dto';
import { UpdateItemDto } from './../dto/update-item.dto';

import { Items } from './../entities/item.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items)
    private itemRepository: Repository<Items>,

    private userContextService: UserContextService,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const newItem = this.itemRepository.create(createItemDto);

    newItem.restaurantIdRestaurant = restaurantId;

    newItem.dailyAvailabilities = []

    return await this.itemRepository.save(newItem);
  }

  async findAll() {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const list = await this.itemRepository.find({
      where: { status: 1, restaurantIdRestaurant: restaurantId },
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
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.itemRepository.findOne({
      where: { id_item: id, restaurantIdRestaurant: restaurantId, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This item #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.itemRepository.findOneBy({ id_item: id });

    this.itemRepository.merge(item, updateItemDto);

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new UnauthorizedException(
        `This item #${id} not belong to your restaurant`,
      );
    }

    return this.itemRepository.save(item);
  }

  async remove(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const item = await this.itemRepository.findOneBy({ id_item: id });
    const deleteItem: UpdateItemDto = {
      status: 0,
    };

    this.itemRepository.merge(item, deleteItem);

    if (item.restaurantIdRestaurant !== restaurantId) {
      throw new UnauthorizedException(
        `This item #${id} not belong to your restaurant`,
      );
    }

    return this.itemRepository.save(item);
  }
}
