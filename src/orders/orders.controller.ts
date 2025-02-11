import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {

    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/byclient/:id/:limit/:offset')
  findAllByclient(
    @Param('id') id: string,
    @Param('limit') limit: string,
    @Param('offset') offset: string,
  ) {
    return this.ordersService.findAllByClient(+id, +limit, +offset);
  }

  @Get('/bydates/:datestart/:dateend')
  findAllBydates(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.ordersService.findAllByDates(datestart, dateend);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Public()
  @Get('impressOrder/:id')
  async generateVihDoc(@Param('id') id: string, @Res() res): Promise<void> {
    const buffer = await this.ordersService.generateOrderDoc(+id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment: filename-example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(+id);
    return { message: `Order with id: ${id} deleted successfully` };
  }
}
