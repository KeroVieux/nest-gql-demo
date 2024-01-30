import { Injectable } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class DxPaymentService {
  getHello(): string {
    return 'Hello World!';
  }
  getPaymentServiceBaseUrl(request: Request): string {
    const action = request.headers['x-action'];
    if (action === 'payment') {
      return 'http://localhost:3001';
    } else {
      return 'http://localhost:3002';
    }
  }
}
