import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enviroments } from './enviroments';
import { CostumersModule } from './costumers/costumers.module';
import { AdminModule } from './admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { MulterModule } from '@nestjs/platform-express';
import { UserContextModule } from './userContext/userContext.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: +configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, //para sincronizar las entidades con la base de datos
        autoLoadEntities: true,
        logging: true,
      }),

      inject: [ConfigService],
    }),

    ClientsModule,

    CostumersModule,

    AdminModule,

    OrdersModule,

    AuthModule,

    ReportsModule,

    UserContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
