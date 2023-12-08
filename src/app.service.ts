import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Esta es la API de Antuca RESTAURANTE!';
  }
}
