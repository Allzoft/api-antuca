import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from '../entities/order.entity';
import { Repository, Between, Not } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Clients } from 'src/clients/entities/client.entity';
import { Customers } from 'src/costumers/entities/customer.entity';
import { PaymentType } from 'src/admin/entities/paymentType.entity';
import { States } from 'src/admin/entities/state.entity';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrdersItemsItems } from '../entities/order-item-item.entity';
import { Items } from '../entities/item.entity';
import { OrdersGateway } from '../dailyMonitor.websocket';
import { DailyAvailability } from '../entities/dailyAvailability.entity';

import PDFDocument = require('pdfkit');
import { Buffer } from 'buffer';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,

    @InjectRepository(Clients)
    private clientRepository: Repository<Clients>,

    @InjectRepository(Customers)
    private customerRepository: Repository<Customers>,

    @InjectRepository(PaymentType)
    private paymentTypeRepository: Repository<PaymentType>,

    @InjectRepository(States)
    private stateRepository: Repository<States>,

    @InjectRepository(OrdersItemsItems)
    private orderItemRepository: Repository<OrdersItemsItems>,

    @InjectRepository(Items)
    private itemRepository: Repository<Items>,

    @InjectRepository(DailyAvailability)
    private dailyAvailabilitesRepository: Repository<DailyAvailability>,

    private readonly ordersGateway: OrdersGateway,
     private userContextService: UserContextService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {  
    const restaurantId = this.userContextService.getUser().restaurantIdRestaurant;

    const newOrder = this.orderRepository.create(createOrderDto);

    // Establecer las relaciones
    if (createOrderDto.clientIdClient) {
      newOrder.client = await this.clientRepository.findOne({
        where: { id_client: createOrderDto.clientIdClient },
      });
    }

    if (createOrderDto.customerIdCustomer) {
      newOrder.customer = await this.customerRepository.findOne({
        where: { id_customer: createOrderDto.customerIdCustomer },
      });
    }

    if (createOrderDto.paymentTypeIdPaymentType) {
      newOrder.paymentType = await this.paymentTypeRepository.findOne({
        where: { id_payment_type: createOrderDto.paymentTypeIdPaymentType },
      });
    }

    if (createOrderDto.stateIdState) {
      newOrder.state = await this.stateRepository.findOne({
        where: { id_state: createOrderDto.stateIdState },
      });
    }

    newOrder.restaurantIdRestaurant = restaurantId;

    const savedOrder = await this.orderRepository.save(newOrder);

    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = await Promise.all(
        createOrderDto.items.map(async (item) => {
          const orderItem = this.orderItemRepository.create({
            itemIdItem: item.itemIdItem,
            orderIdOrder: savedOrder.id_order,
            quantity: item.quantity,
          });

          orderItem.item = await this.itemRepository.findOne({
            where: { id_item: item.itemIdItem },
          });

          return orderItem;
        }),
      );

      savedOrder.orderItems = await this.orderItemRepository.save(orderItems);

      // Actualizar la propiedad sold de DailyAvailability
      for (const orderItem of orderItems) {
        const dailyAvailability =
          await this.dailyAvailabilitesRepository.findOne({
            where: {
              date: savedOrder.date,
              itemIdItem: orderItem.itemIdItem,
            },
          });

        if (dailyAvailability) {
          const orderItemsForSumatory = await this.orderItemRepository.find({
            where: {
              itemIdItem: orderItem.itemIdItem,
              order: {
                status: 1,
                date: savedOrder.date,
                state: { priority: Not(0) },
              },
            },
          });

          const allQuantity = orderItemsForSumatory.reduce(
            (total, orderItem) => {
              return total + +orderItem.quantity;
            },
            0,
          );

          dailyAvailability.sold = allQuantity;
          await this.dailyAvailabilitesRepository.save(dailyAvailability);
        }
      }
    }

    this.ordersGateway.emitNewOrder(savedOrder);
    return savedOrder;
  }

  async findAll() {
    const list = await this.orderRepository.find({
      relations: [
        'client',
        'customer',
        'state',
        'paymentType',
        'orderItems.item',
      ],
      where: { status: 1 },
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
    const order = await this.orderRepository.findOne({
      where: { id_order: id, status: 1 },
      relations: [
        'client',
        'customer',
        'state',
        'paymentType',
        'orderItems.item',
      ],
    });
    if (!order) {
      throw new NotFoundException(`This order #${id} not found`);
    }
    return order;
  }

  async findAllByClient(id: number, limit: number, offset: number) {
    const list = await this.orderRepository.find({
      relations: [
        'client',
        'customer',
        'state',
        'paymentType',
        'orderItems.item',
      ],
      where: { clientIdClient: id, status: 1 },
      take: limit,
      skip: offset,
      order: {
        id_order: 'DESC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'Empty list' });
    }
    return list;
  }

  async findAllByDates(datestart: any, dateend: any) {
    datestart = datestart + 'T00:00:00.000Z';
    dateend = dateend + 'T23:59:59.999Z';
    const list = await this.orderRepository.find({
      relations: [
        'client',
        'customer',
        'state',
        'paymentType',
        'orderItems.item',
      ],
      where: {
        date: Between(datestart, dateend),
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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id_order: id });
    if (!order) {
      throw new NotFoundException(`This order #${id} not found`);
    }

    if (updateOrderDto.clientIdClient) {
      const client = await this.clientRepository.findOne({
        where: { id_client: updateOrderDto.clientIdClient },
      });
      order.client = client;
    }

    if (updateOrderDto.customerIdCustomer) {
      const customer = await this.customerRepository.findOne({
        where: { id_customer: updateOrderDto.customerIdCustomer },
      });
      order.customer = customer;
    }

    if (updateOrderDto.paymentTypeIdPaymentType) {
      const paymentType = await this.paymentTypeRepository.findOne({
        where: { id_payment_type: updateOrderDto.paymentTypeIdPaymentType },
      });
      order.paymentType = paymentType;
    }

    if (updateOrderDto.stateIdState) {
      const state = await this.stateRepository.findOne({
        where: { id_state: updateOrderDto.stateIdState },
      });
      order.state = state;
    }

    this.orderRepository.merge(order, updateOrderDto);

    // Si hay items en el DTO de actualización
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      await this.orderItemRepository.delete({ orderIdOrder: order.id_order });

      const orderItems = await Promise.all(
        updateOrderDto.items.map(async (item) => {
          console.log(order.id_order);

          const orderItem = this.orderItemRepository.create({
            itemIdItem: item.itemIdItem,
            orderIdOrder: order.id_order,
            quantity: item.quantity,
          });

          orderItem.item = await this.itemRepository.findOne({
            where: { id_item: item.itemIdItem },
          });

          return orderItem;
        }),
      );
      console.log(orderItems);

      order.orderItems = await this.orderItemRepository.save(orderItems);
    }

    console.log(order);

    const savedOrder = await this.orderRepository.save(order);

    const dailyAvailabilities = await this.dailyAvailabilitesRepository.find({
      where: { date: savedOrder.date },
    });

    if (dailyAvailabilities.length > 0) {
      for (const dailyAvailability of dailyAvailabilities) {
        const orderItemsForSumatory = await this.orderItemRepository.find({
          where: {
            itemIdItem: dailyAvailability.itemIdItem,
            order: {
              status: 1,
              date: savedOrder.date,
              state: { priority: Not(0) },
            },
          },
        });
        const allQuantity = orderItemsForSumatory.reduce((total, orderItem) => {
          return total + +orderItem.quantity;
        }, 0);

        dailyAvailability.sold = allQuantity;
        await this.dailyAvailabilitesRepository.save(dailyAvailability);
      }
    }

    this.ordersGateway.emitUpdatedOrder(savedOrder);
    return savedOrder;
  }

  async remove(id: number) {
    const item = await this.orderRepository.findOneBy({ id_order: id });
    const deleteOrder: UpdateOrderDto = {
      status: 0,
    };

    this.orderRepository.merge(item, deleteOrder);

    const deleteItem = await this.orderRepository.save(item);

    const dailyAvailabilities = await this.dailyAvailabilitesRepository.find({
      where: { date: deleteItem.date },
    });

    if (dailyAvailabilities.length > 0) {
      for (const dailyAvailability of dailyAvailabilities) {
        const orderItemsForSumatory = await this.orderItemRepository.find({
          where: {
            itemIdItem: dailyAvailability.itemIdItem,
            order: {
              status: 1,
              date: deleteItem.date,
              state: { priority: Not(0) },
            },
          },
        });
        const allQuantity = orderItemsForSumatory.reduce((total, orderItem) => {
          return total + +orderItem.quantity;
        }, 0);

        dailyAvailability.sold = allQuantity;
        await this.dailyAvailabilitesRepository.save(dailyAvailability);
      }
    }

    this.ordersGateway.emitDeletedOrder(deleteItem);
    return deleteItem;
  }

  async generateOrderDoc(id: number): Promise<Buffer> {
    const order = await this.orderRepository.findOne({
      where: { id_order: id },
      relations: [
        'client',
        'customer',
        'state',
        'paymentType',
        'orderItems.item',
      ],
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [227, 841.88],
        margins: { top: 10, bottom: 20, left: 25, right: 15 },
      });

      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(
          order.client.name.toLocaleUpperCase() +
            ' ' +
            order.client.lastname.toLocaleUpperCase(),
          doc.x,
          20,
          {
            align: 'center',
          },
        );

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(
          `--------------------------------------------------------`,
          25,
          doc.y,
          {
            align: 'center',
          },
        );

      const currentY = doc.y;

      doc
        .fontSize(8)
        .font('Helvetica')
        .text(
          this.extractTimeCreatedAt(order.created_at.toString()),
          25,
          currentY,
          {
            align: 'left',
          },
        );

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Bs. ${order.total_amount}`, 60, currentY, {
          align: 'right',
          width: doc.page.width - 60 - 15,
        });

      doc

        .font('Helvetica-Bold')
        .text(
          `--------------------------------------------------------`,
          25,
          doc.y,
          {
            align: 'center',
          },
        );

      doc.moveDown();

      order.orderItems.forEach((orderItems) => {
        doc
          .fontSize(12)
          .font('Helvetica')
          .text(orderItems.quantity + ' - ' + orderItems.item.name, 30, doc.y, {
            align: 'left',
          });
      });

      if (order.notes) {
        doc.moveDown();
        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Notas: ' + order.notes, 25, doc.y, {
            align: 'left',
          });
      }

      doc.moveDown();

      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(order.service_mode.toLocaleUpperCase(), {
          align: 'center',
        });

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`ID: ${order.id_order}`, 60, 5, {
          align: 'right',
          width: doc.page.width - 60 - 15,
        });

      // Almacena el PDF en un buffer
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);

        resolve(pdfBuffer);
      });

      doc.on('error', (error) => {
        reject(error);
      });

      doc.end();
    });
  }

  private extractTimeCreatedAt(datetime: string): string | null {
    const match = datetime.match(/\b(\d{2}:\d{2})\b/);
    return match ? match[1] : null;
  }
}
