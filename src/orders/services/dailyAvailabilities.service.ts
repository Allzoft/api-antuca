import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { CreateDailyAvailabilityDto } from './../dto/create-dailyAvailability.dto';
import { UpdateDailyAvailabilityDto } from './../dto/update-dailyAvailability.dto';

import { DailyAvailability } from './../entities/dailyAvailability.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class DailyAvailabilitysService {
  constructor(
    @InjectRepository(DailyAvailability)
    private dailyAvailabilityRepository: Repository<DailyAvailability>,

    private userContextService: UserContextService,
  ) {}

  async create(createDailyAvailabilityDto: CreateDailyAvailabilityDto) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const dailyAvailability = await this.dailyAvailabilityRepository.findOne({
      where: {
        date: createDailyAvailabilityDto.date,
        itemIdItem: createDailyAvailabilityDto.itemIdItem,
        retaurantIdRestaurant: restaurantId,
      },
    });

    if (dailyAvailability) {
      throw new ConflictException(
        'Ya existe una disponibilidad para esta fecha.',
      );
    }

    const newDailyAvailability = this.dailyAvailabilityRepository.create(
      createDailyAvailabilityDto,
    );

    newDailyAvailability.retaurantIdRestaurant = restaurantId;

    return await this.dailyAvailabilityRepository.save(newDailyAvailability);
  }

  async findAll() {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const list = await this.dailyAvailabilityRepository.find({
      where: { status: 1, retaurantIdRestaurant: restaurantId },
      relations: ['item'],
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }

    return list;
  }

  async findAllByDates(datestart: any, dateend: any) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    datestart = datestart + 'T00:00:00.000Z';
    dateend = dateend + 'T23:59:59.999Z';

    const list = await this.dailyAvailabilityRepository.find({
      relations: { item: true },
      where: {
        date: Between(datestart, dateend),
        retaurantIdRestaurant: restaurantId,
        status: 1,
      },
      order: {
        date: 'DESC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findOne(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;
    const dailyAvailability = await this.dailyAvailabilityRepository.findOne({
      where: { id_daily_availability: id, status: 1 },
      relations: ['item'],
    });
    if (!dailyAvailability) {
      throw new NotFoundException(`This dailyAvailability #${id} not found`);
    }
    if (dailyAvailability.retaurantIdRestaurant !== restaurantId) {
      throw new UnauthorizedException(
        `This dailyAvailability #${id} not belong to your restaurant`,
      );
    }

    return dailyAvailability;
  }

  async update(
    id: number,
    updateDailyAvailabilityDto: UpdateDailyAvailabilityDto,
  ) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const dailyAvailability = await this.dailyAvailabilityRepository.findOneBy({
      id_daily_availability: id,
    });

    this.dailyAvailabilityRepository.merge(
      dailyAvailability,
      updateDailyAvailabilityDto,
    );

    if (dailyAvailability.retaurantIdRestaurant !== restaurantId) {
      throw new UnauthorizedException(
        `This dailyAvailability #${id} not belong to your restaurant`,
      );
    }

    return this.dailyAvailabilityRepository.save(dailyAvailability);
  }

  async remove(id: number) {
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const dailyAvailability = await this.dailyAvailabilityRepository.findOneBy({
      id_daily_availability: id,
    });

    if (dailyAvailability.retaurantIdRestaurant !== restaurantId) {
      throw new UnauthorizedException(
        `This dailyAvailability #${id} not belong to your restaurant`,
      );
    }

    const deleteDailyAvailability: UpdateDailyAvailabilityDto = {
      status: 0,
    };

    this.dailyAvailabilityRepository.merge(
      dailyAvailability,
      deleteDailyAvailability,
    );
    return this.dailyAvailabilityRepository.save(dailyAvailability);
  }
}
