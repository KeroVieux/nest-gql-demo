import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { DxPaymentService } from './dx-payment-service';
import { Request } from 'express';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let resolver: AppResolver;
  let dxPaymentService: DxPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        DxPaymentService,
        {
          provide: AppService,
          useValue: {
            getBaseUrl: jest.fn().mockReturnValue('http://localhost:3001'),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    dxPaymentService = module.get<DxPaymentService>(DxPaymentService);
  });

  describe('getBaseUrl', () => {
    it('should return the message from appService', () => {
      const mockRequest: unknown = {
        headers: {
          'x-action': 'payment',
        },
      };
      jest
        .spyOn(dxPaymentService, 'getPaymentServiceBaseUrl')
        .mockReturnValue('http://localhost:3001');

      const result = resolver.getBaseUrl({ req: mockRequest as Request });

      expect(result).toBe('http://localhost:3001');
    });
  });
});
