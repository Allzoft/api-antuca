import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from 'src/clients/entities/client.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Between, Repository } from 'typeorm';
import { DailyReport } from '../interfaces/dailyReport';
import { UserContextService } from 'src/userContext/service/userContext.service';
import * as moment from 'moment';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,
    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,

    private userContextService: UserContextService,
  ) {}

  public async getDailyReport(
    datestart: any,
    dateend: any,
  ): Promise<DailyReport> {
    const filterDatestart: any = datestart + 'T00:00:00.000Z';
    const filterDateend: any = dateend + 'T23:59:59.999Z';
    const filterEndCustomers: any = moment(dateend)
      .add(1, 'day')
      .utc()
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    console.log('restaurantId', this.userContextService.getUser());
    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const orders = await this.orderRepository.find({
      relations: ['orderItems'],
      where: {
        date: Between(filterDatestart, filterDateend),
        status: 1,
        restaurantIdRestaurant: restaurantId,
        state: { priority: 6 },
      },
    });

    if (!orders.length) {
      return {
        total_menus: 0,
        weeklyGrowthRate_menus: 0,
        total_incomes: 0,
        weeklyGrowthRate_incomes: 0,
        total_orders: 0,
        weeklyGrowthRate_orders: 0,
        total_customers: 0,
        weeklyGrowthRate_customers: 0,
      };
    }

    const total_menus = orders.reduce(
      (acc, order) =>
        acc +
        order.orderItems.reduce(
          (acc, orderItem) => acc + orderItem.quantity,
          0,
        ),
      0,
    );

    const total_incomes = orders.reduce(
      (acc, order) => acc + +order.total_amount,
      0,
    );

    const total_customers = await this.clientRepository.count({
      where: {
        restaurantIdRestaurant: restaurantId,
        created_at: Between(filterDatestart, filterDateend),
        status: 1,
      },
    });

    //crear nuevas variables para filtrado de fecha de una semana atras en formato ISOstring
    const lastWeekStart: any = moment(datestart)
      .subtract(1, 'weeks')
      .utc()
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const lastWeekEnd: any = moment(dateend)
      .subtract(1, 'weeks')
      .utc()
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    console.log(lastWeekStart);

    const oldOrders = await this.orderRepository.find({
      relations: ['orderItems'],
      where: {
        date: Between(lastWeekStart, lastWeekEnd),
        status: 1,
        restaurantIdRestaurant: restaurantId,
        state: { priority: 6 },
      },
    });

    const oldTotal_menus = oldOrders.reduce(
      (acc, order) =>
        acc +
        order.orderItems.reduce(
          (acc, orderItem) => acc + orderItem.quantity,
          0,
        ),
      0,
    );

    const weeklyGrowthRate_menus = total_menus
      ? ((total_menus - oldTotal_menus) / total_menus) * 100
      : 0;

    const oldTotal_incomes = oldOrders.reduce(
      (acc, order) => acc + +order.total_amount,
      0,
    );

    const weeklyGrowthRate_incomes = total_incomes
      ? ((total_incomes - oldTotal_incomes) / total_incomes) * 100
      : 0;

    const weeklyGrowthRate_orders = orders.length
      ? ((orders.length - oldOrders.length) / orders.length) * 100
      : 0;

    const oldClients = await this.clientRepository.count({
      where: {
        restaurantIdRestaurant: restaurantId,
        created_at: Between(lastWeekStart, lastWeekEnd),
        status: 1,
      },
    });

    const weeklyGrowthRate_customers = total_customers
      ? ((total_customers - oldClients) / total_customers) * 100
      : 0;

    return {
      total_menus,
      weeklyGrowthRate_menus,
      total_incomes,
      weeklyGrowthRate_incomes,
      total_orders: orders.length,
      weeklyGrowthRate_orders,
      total_customers,
      weeklyGrowthRate_customers,
    };
  }
}
