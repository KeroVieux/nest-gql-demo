import { Injectable } from '@nestjs/common';
@Injectable()
export class Cal {
  plus(a: number, b: number) {
    return a + b;
  }
  by(a: number, b: number) {
    return a + b;
  }
}
