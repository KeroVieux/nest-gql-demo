import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Cal } from './cal';
import { DxPaymentService } from './dx-payment-service';
import { Request } from 'express';

describe('AppService', () => {
  let service: AppService;
  let cal: Cal;
  let dxPaymentService: DxPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: Cal,
          useValue: {
            plus: jest.fn().mockReturnValue(3),
          },
        },
        {
          provide: DxPaymentService,
          useValue: {
            getPaymentServiceBaseUrl: jest
              .fn()
              .mockReturnValue('http://localhost:3001'),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    cal = module.get<Cal>(Cal);
    dxPaymentService = module.get<DxPaymentService>(DxPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Cal()', () => {
    it('should be defined', () => {
      expect(cal).toBeDefined();
    });
    describe('Cal().plus()', () => {
      it('should be defined', () => {
        expect(cal.plus).toBeDefined();
      });
      it('should be return a correct result', () => {
        const res = service.getResultFromPlus(1, 2);
        expect(res).toEqual(3);
        expect(cal.plus).toHaveBeenCalled();
      });
    });
  });
  describe('DxPaymentService()', () => {
    it('should be defined', () => {
      expect(dxPaymentService).toBeDefined();
    });
    describe('DxPaymentService().getPaymentServiceBaseUrl()', () => {
      it('should be defined', () => {
        expect(dxPaymentService.getPaymentServiceBaseUrl).toBeDefined();
      });
      it('should be return a correct result', () => {
        const mockRequest: unknown = {
          req: {
            headers: {
              'x-action': 'payment',
            },
          },
        };
        const baseUrl = dxPaymentService.getPaymentServiceBaseUrl(
          mockRequest as Request,
        );
        expect(baseUrl).toEqual('http://localhost:3001');
        expect(dxPaymentService.getPaymentServiceBaseUrl).toHaveBeenCalled();
      });
    });
  });
});
