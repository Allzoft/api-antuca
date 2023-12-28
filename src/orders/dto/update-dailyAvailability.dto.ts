import { PartialType } from '@nestjs/swagger';
import { CreateDailyAvailabilityDto } from './create-dailyAvailability.dto';

export class UpdateDailyAvailabilityDto extends PartialType(
  CreateDailyAvailabilityDto,
) {}
