import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRestaurantDto } from './../dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './../dto/update-restaurant.dto';

import { Restaurants } from './../entities/restaurant.entity';

import * as bcrypt from 'bcrypt';
import { UserContextService } from 'src/userContext/service/userContext.service';
@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurants)
    private restaurantRepository: Repository<Restaurants>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);

    return await this.restaurantRepository.save(newRestaurant);
  }

  async findAll() {
    const list = await this.restaurantRepository.find({});
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.restaurantRepository.findOne({
      where: { id_restaurant: id },
    });
    if (!item) {
      throw new NotFoundException(`This restaurant #${id} not found`);
    }

    return item;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const item = await this.restaurantRepository.findOneBy({
      id_restaurant: id,
    });

    this.restaurantRepository.merge(item, updateRestaurantDto);

    return this.restaurantRepository.save(item);
  }
}
