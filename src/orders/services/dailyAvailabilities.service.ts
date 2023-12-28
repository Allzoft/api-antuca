import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDailyAvailabilityDto } from './../dto/create-dailyAvailability.dto';
import { UpdateDailyAvailabilityDto } from './../dto/update-dailyAvailability.dto';

import { DailyAvailability } from './../entities/dailyAvailability.entity';

@Injectable()
export class DailyAvailabilitysService {
  constructor(
    @InjectRepository(DailyAvailability)
    private dailyAvailabilityRepository: Repository<DailyAvailability>,
  ) {}

  async create(createDailyAvailabilityDto: CreateDailyAvailabilityDto) {
    const newDailyAvailability = this.dailyAvailabilityRepository.create(
      createDailyAvailabilityDto,
    );

    return await this.dailyAvailabilityRepository.save(newDailyAvailability);
  }

  async findAll() {
    const list = await this.dailyAvailabilityRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findOne(id: number) {
    const dailyAvailability = await this.dailyAvailabilityRepository.findOne({
      where: { id_daily_availability: id, status: 1 },
    });
    if (!dailyAvailability) {
      throw new NotFoundException(`This dailyAvailability #${id} not found`);
    }
    return dailyAvailability;
  }

  async update(
    id: number,
    updateDailyAvailabilityDto: UpdateDailyAvailabilityDto,
  ) {
    const dailyAvailability = await this.dailyAvailabilityRepository.findOneBy({
      id_daily_availability: id,
    });

    this.dailyAvailabilityRepository.merge(
      dailyAvailability,
      updateDailyAvailabilityDto,
    );

    return this.dailyAvailabilityRepository.save(dailyAvailability);
  }

  async remove(id: number) {
    const dailyAvailability = await this.dailyAvailabilityRepository.findOneBy({
      id_daily_availability: id,
    });
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
