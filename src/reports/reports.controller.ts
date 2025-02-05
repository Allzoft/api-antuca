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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReportsService } from './services/reports.service';

@UseGuards(JwtAuthGuard)
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dailyReports/:datestart/:dateend')
  findAll(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.reportsService.getDailyReport(datestart, dateend);
  }
}
