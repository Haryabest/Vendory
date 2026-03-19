import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Vendory API - Welcome to the Marketplace!';
  }
}
