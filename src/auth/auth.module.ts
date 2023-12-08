import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import config from './../config';
import { ClientsModule } from 'src/clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/clients/entities/client.entity';
import { Customers } from 'src/costumers/entities/customer.entity';

import { CostumersModule } from 'src/costumers/costumers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients, Customers]),
    CostumersModule,
    PassportModule,
    ClientsModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
