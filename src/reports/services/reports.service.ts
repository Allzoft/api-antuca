import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from 'src/clients/entities/client.entity';
import { Orders, ServiceMode } from 'src/orders/entities/order.entity';
import { Between, Repository } from 'typeorm';
import { DailyReport } from '../interfaces/dailyReport';
import { UserContextService } from 'src/userContext/service/userContext.service';
import * as moment from 'moment';
import 'moment/locale/es';
import { OrderSumaryByMode } from '../interfaces/orderSumaryByServiceMode';
import {
  FinancialSummary,
  NewClientsSummary,
} from '../interfaces/financialSumary';
moment.locale('es');

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

  public async getOrdersSummaryByMode(
    datestart: any,
    dateend: any,
  ): Promise<OrderSumaryByMode> {
    const filterDatestart: any = datestart + 'T00:00:00.000Z';
    const filterDateend: any = dateend + 'T23:59:59.999Z';

    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    const orders = await this.orderRepository.find({
      where: {
        date: Between(filterDatestart, filterDateend),
        status: 1,
        restaurantIdRestaurant: restaurantId,
        state: { priority: 6 },
      },
    });

    if (!orders.length) {
      return {
        total_orders: 0,
        orders_by_delivery: 0,
        orders_by_pickup: 0,
        orders_by_table: 0,
        orders_by_mix: 0,
      };
    }

    console.log(filterDatestart, filterDateend);
    console.log(orders.length);

    const ordersByPickup = orders.filter(
      (o) => o.service_mode === ServiceMode.PARA_LLEVAR,
    ).length;

    const ordersInSala = orders.filter(
      (o) => o.service_mode === ServiceMode.EN_SALA,
    ).length;

    const ordersByDelivery = orders.filter(
      (o) => o.service_mode === ServiceMode.DELIVERY,
    ).length;

    const orderByMix = orders.filter(
      (o) => o.service_mode === ServiceMode.MIXTO,
    ).length;

    return {
      total_orders: orders.length,
      orders_by_delivery: ordersByDelivery,
      orders_by_pickup: ordersByPickup,
      orders_by_table: ordersInSala,
      orders_by_mix: orderByMix,
    };
  }

  public async getFinancialSummary(
    period: 'monthly' | 'weekly' | 'daily',
  ): Promise<FinancialSummary> {
    let filterStart: Date;
    let filterEnd: Date;
    let buckets: number;

    // Configuramos el rango de fechas y la cantidad de buckets según el período
    if (period === 'monthly') {
      buckets = 12;
      filterStart = moment()
        .subtract(11, 'months')
        .utc()
        .startOf('month')
        .toDate();
      filterEnd = moment().utc().endOf('month').toDate();
    } else if (period === 'weekly') {
      buckets = 8;
      // Obtenemos el lunes de la semana actual en UTC
      const currentMonday = moment().isoWeekday(1).utc().startOf('day');
      filterStart = moment(currentMonday).subtract(7, 'weeks').utc().toDate();
      filterEnd = moment().isoWeekday(7).utc().endOf('day').toDate();
    } else if (period === 'daily') {
      buckets = 7;
      filterStart = moment().subtract(6, 'days').utc().startOf('day').toDate();
      filterEnd = moment().utc().endOf('day').toDate();
    }

    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    // Se filtran las órdenes según el rango calculado.
    const orders = await this.orderRepository.find({
      where: {
        date: Between(filterStart, filterEnd),
        status: 1,
        restaurantIdRestaurant: restaurantId,
        state: { priority: 6 },
      },
    });

    // Inicializamos el arreglo de etiquetas
    let labels: string[] = [];
    // Inicializamos los ingresos (incomes) y egresos (outcomes) con ceros
    let incomes: number[] = new Array(buckets).fill(0);
    let outcomes: number[] = new Array(buckets).fill(0);

    // Si no hay órdenes, generamos las etiquetas y retornamos el resumen con valores en cero.
    if (!orders.length) {
      if (period === 'monthly') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.utc().format('MMM'));
          labelDate.add(1, 'month');
        }
      } else if (period === 'weekly') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.utc().format('DD/MM'));
          labelDate.add(1, 'week');
        }
      } else if (period === 'daily') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.utc().format('DD'));
          labelDate.add(1, 'day');
        }
      }

      return {
        total_income: 0,
        total_outcome: 0,
        incomes,
        outcomes,
        labels,
      };
    }

    // Calculamos el total de ingresos
    const total_income = orders.reduce(
      (acc, order) => acc + Number(order.total_amount),
      0,
    );

    // Agrupamos las órdenes en los buckets según el período
    if (period === 'monthly') {
      const current = moment(filterEnd);
      orders.forEach((order) => {
        const orderMoment = moment(order.date);
        // Calculamos la diferencia en meses entre filterEnd y la fecha de la orden.
        const diffMonths = current.diff(orderMoment, 'months');
        if (diffMonths >= 0 && diffMonths < buckets) {
          // El bucket actual es el último (índice buckets - 1)
          const index = buckets - 1 - diffMonths;
          incomes[index] += Number(order.total_amount);
        }
      });
    } else if (period === 'weekly') {
      const currentMonday = moment(filterEnd).isoWeekday(1).startOf('day');
      orders.forEach((order) => {
        const orderMonday = moment(order.date).isoWeekday(1).startOf('day');
        const diffWeeks = currentMonday.diff(orderMonday, 'weeks');
        if (diffWeeks >= 0 && diffWeeks < buckets) {
          const index = buckets - 1 - diffWeeks;
          incomes[index] += Number(order.total_amount);
        }
      });
    } else if (period === 'daily') {
      const endDay = moment(filterEnd).startOf('day');
      orders.forEach((order) => {
        const orderDay = moment(order.date).startOf('day');
        const diffDays = endDay.diff(orderDay, 'days');
        if (diffDays >= 0 && diffDays < buckets) {
          const index = buckets - 1 - diffDays;
          incomes[index] += Number(order.total_amount);
        }
      });
    }

    // Generamos las etiquetas (labels) para cada bucket
    if (period === 'monthly') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        // 'MMM' devuelve el mes abreviado, por ejemplo "ene", "feb", etc.
        // Si prefieres la primera letra en mayúscula, podrías aplicar una transformación.
        labels.push(labelDate.utc().format('MM/YY'));
        labelDate.add(1, 'month');
      }
    } else if (period === 'weekly') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        // Se muestra la fecha (lunes) de cada semana en formato "DD/MM"
        labels.push(labelDate.utc().format('DD/MM'));
        labelDate.add(1, 'week');
      }
    } else if (period === 'daily') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        // Se muestra el día del mes (por ejemplo, "01", "02", etc.)
        labels.push(labelDate.utc().format('DD'));
        labelDate.add(1, 'day');
      }
    }

    return {
      total_income,
      total_outcome: 0, // Actualmente outcomes se mantiene en 0.
      incomes,
      outcomes,
      labels,
    };
  }

  public async getNewClients(
    period: 'monthly' | 'weekly' | 'daily',
  ): Promise<NewClientsSummary> {
    let filterStart: Date;
    let filterEnd: Date;
    let buckets: number;

    if (period === 'monthly') {
      buckets = 12;
      filterStart = moment()
        .subtract(11, 'months')
        .utc()
        .startOf('month')
        .toDate();
      filterEnd = moment().utc().endOf('month').toDate();
    } else if (period === 'weekly') {
      buckets = 8;
      // Obtenemos el lunes de la semana actual en UTC
      const currentMonday = moment().isoWeekday(1).utc().startOf('day');
      filterStart = moment(currentMonday).subtract(7, 'weeks').utc().toDate();
      filterEnd = moment().isoWeekday(7).utc().endOf('day').toDate();
    } else if (period === 'daily') {
      buckets = 7;
      filterStart = moment().subtract(6, 'days').utc().startOf('day').toDate();
      filterEnd = moment().utc().endOf('day').toDate();
    }

    const restaurantId =
      this.userContextService.getUser().restaurantIdRestaurant;

    // Se filtran las órdenes según el rango calculado.
    const clients = await this.clientRepository.find({
      where: {
        created_at: Between(filterStart, filterEnd),
        status: 1,
        restaurantIdRestaurant: restaurantId,
      },
    });

    // Inicializamos el arreglo de etiquetas
    let labels: string[] = [];
    let clients_value: number[] = new Array(buckets).fill(0);

    if (!clients.length) {
      if (period === 'monthly') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.format('MMM'));
          labelDate.add(1, 'month');
        }
      } else if (period === 'weekly') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.format('DD/MM'));
          labelDate.add(1, 'week');
        }
      } else if (period === 'daily') {
        let labelDate = moment(filterStart);
        for (let i = 0; i < buckets; i++) {
          labels.push(labelDate.format('DD'));
          labelDate.add(1, 'day');
        }
      }

      return {
        total_clients: 0,
        labels,
        clients_value,
      };
    }

    // Calculamos el total de clientes
    const total_clients = clients.length;

    // Agrupamos los clientes en los buckets según el período
    if (period === 'monthly') {
      const current = moment(filterEnd);
      clients.forEach((client) => {
        const clientMoment = moment(client.created_at);
        const diffMonths = current.diff(clientMoment, 'months');
        if (diffMonths >= 0 && diffMonths < buckets) {
          const index = buckets - 1 - diffMonths;
          clients_value[index] += 1;
        }
      });
    } else if (period === 'weekly') {
      const currentMonday = moment(filterEnd).isoWeekday(1).startOf('day');
      clients.forEach((client) => {
        const clientMonday = moment(client.created_at)
          .isoWeekday(1)
          .startOf('day');
        const diffWeeks = currentMonday.diff(clientMonday, 'weeks');
        if (diffWeeks >= 0 && diffWeeks < buckets) {
          const index = buckets - 1 - diffWeeks;
          clients_value[index] += 1;
        }
      });
    } else if (period === 'daily') {
      const endDay = moment(filterEnd).startOf('day');
      clients.forEach((client) => {
        const clientDay = moment(client.created_at).startOf('day');
        const diffDays = endDay.diff(clientDay, 'days');
        if (diffDays >= 0 && diffDays < buckets) {
          const index = buckets - 1 - diffDays;
          clients_value[index] += 1;
        }
      });
    }

    // Generamos las etiquetas (labels) para cada bucket
    if (period === 'monthly') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        labels.push(labelDate.utc().format('MM/YY'));
        labelDate.add(1, 'month');
      }
    } else if (period === 'weekly') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        labels.push(labelDate.utc().format('DD/MM'));
        labelDate.add(1, 'week');
      }
    } else if (period === 'daily') {
      let labelDate = moment(filterStart);
      for (let i = 0; i < buckets; i++) {
        labels.push(labelDate.utc().format('DD'));
        labelDate.add(1, 'day');
      }
    }

    return {
      total_clients,
      labels,
      clients_value,
    };
  }
}
