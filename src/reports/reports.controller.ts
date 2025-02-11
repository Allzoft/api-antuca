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

  @Get('dailyReport/:datestart/:dateend')
  getDailyReport(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.reportsService.getDailyReport(datestart, dateend);
  }

  @Get('ordersSummary/:datestart/:dateend')
  getOrdersSummaryByMode(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.reportsService.getOrdersSummaryByMode(datestart, dateend);
  }

  @Get('financialSummary/:period')
  getFinancialSummary(
    @Param('period') period: 'monthly' | 'weekly' | 'daily',
  ) {
    return this.reportsService.getFinancialSummary(period);
  }

  @Get('newClients/:period')
  getNewClients(
    @Param('period') period: 'monthly' | 'weekly' | 'daily',
  ) {
    return this.reportsService.getNewClients(period);
  }
}
