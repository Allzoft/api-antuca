import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DailyAvailabilitysService } from './services/dailyAvailabilities.service';
import { CreateDailyAvailabilityDto } from './dto/create-dailyAvailability.dto';
import { UpdateDailyAvailabilityDto } from './dto/update-dailyAvailability.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('daily-availability')
export class DailyAvailabilitiesController {
  constructor(
    private readonly dailyAvailabilitiesService: DailyAvailabilitysService,
  ) {}

  @Post()
  create(@Body() createStatusDto: CreateDailyAvailabilityDto) {
    return this.dailyAvailabilitiesService.create(createStatusDto);
  }

  @Get()
  findAll() {
    return this.dailyAvailabilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyAvailabilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDailyAvailabilityDto,
  ) {
    return this.dailyAvailabilitiesService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.dailyAvailabilitiesService.remove(+id);
    return {
      message: `DailyAvailability with id: ${id} deleted successfully`,
    };
  }
}
