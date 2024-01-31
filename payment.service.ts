import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { OutsidePaymentService } from '../outside-payment/outside-payment.service';
import { AxiosResponse } from 'axios';
const githubRes = {
  login: 'KeroVieux',
  id: 9433817,
};
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let outsidePaymentService: OutsidePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: OutsidePaymentService,
          useValue: {
            getPaymentDetails: jest.fn().mockResolvedValue(githubRes),
          },
        },
      ],
    }).compile();

    paymentService = module.get(PaymentService);
    outsidePaymentService = module.get(OutsidePaymentService);
  });
  describe('Core Functionality', () => {
    it('should validate required parameters', async () => {
      try {
        await paymentService.getPaymentDetails('');
      } catch (e) {
        expect(e.message).toEqual('Required "id" param missing');
      }
    });

    it('should call external service', async () => {
      jest.spyOn(outsidePaymentService, 'getPaymentDetails');
      const param = 'KeroVieux';
      await paymentService.getPaymentDetails(param);

      expect(outsidePaymentService.getPaymentDetails).toHaveBeenCalledWith(
        param,
      );
      expect(outsidePaymentService.getPaymentDetails).toHaveBeenCalledTimes(1);
    });

    //   it('sends correct request options', async () => {
    //     // assertion
    //   });
    //
    //   it('returns standardized payment object', async () => {
    //     // assertions
    //   });
    //
    //   it('handles connection errors', async () => {
    //     // assertion
    //   });
    // });
    //
    // describe('Input Validation', () => {
    //   // input validation tests
    // });
    //
    // describe('Mock Data', () => {
    //   // mock data tests
    // });
    //
    // describe('Edge Cases', () => {
    //   // edge case tests
    // });
    //
    // describe('Async Behavior', () => {
    //   // async behavior tests
    // });
    //
    // describe('Parameterization', () => {
    //   // parameterization tests
  });
  describe('Mock Data', () => {
    it('should return the correct response', () => {
      expect(paymentService.getPaymentDetails('KeroVieux')).resolves.toEqual(
        githubRes,
      );
    });
    it('should handle empty response', () => {
      const error = new Error('Not Found');
      jest
        .spyOn(outsidePaymentService, 'getPaymentDetails')
        .mockRejectedValue(error);
      expect(
        paymentService.getPaymentDetails('KeroVieux'),
      ).rejects.toThrowError(error);
    });
  });
  describe('Async Behavior', () => {
    it('should return a promise', () => {
      expect(paymentService.getPaymentDetails('KeroVieux')).toBeInstanceOf(
        Promise,
      );
    });
    it('should handle timeouts', () => {
      jest
        .spyOn(outsidePaymentService, 'getPaymentDetails')
        .mockImplementation(
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 1000),
            ),
        );
      expect(paymentService.getPaymentDetails('KeroVieux')).rejects.toThrow(
        'Timeout',
      );
    });
    it('should handle parallel calls', async () => {
      jest.spyOn(outsidePaymentService, 'getPaymentDetails').mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: githubRes,
                  status: 200,
                  statusText: 'OK',
                } as AxiosResponse),
              1000,
            ),
          ),
      );
      const promise1 = await paymentService.getPaymentDetails('KeroVieux');
      const promise2 = await paymentService.getPaymentDetails('KeroVieux');
      expect(promise1).toEqual(promise2);
    });
  });
  describe('Error Handling', () => {
    it('should handle network errors', () => {
      jest
        .spyOn(outsidePaymentService, 'getPaymentDetails')
        .mockRejectedValue(new Error('Network Error'));
      expect(paymentService.getPaymentDetails('KeroVieux')).rejects.toThrow(
        'Network Error',
      );
    });
    it('should handle unexpected responses', () => {
      jest
        .spyOn(outsidePaymentService, 'getPaymentDetails')
        .mockRejectedValue(new Error('Unexpected response'));
      expect(paymentService.getPaymentDetails('KeroVieux')).rejects.toThrow(
        'Unexpected response',
      );
    });
    it('should handle API errors', () => {
      jest
        .spyOn(outsidePaymentService, 'getPaymentDetails')
        .mockRejectedValue(new Error('API Error'));
      expect(paymentService.getPaymentDetails('KeroVieux')).rejects.toThrow(
        'API Error',
      );
    });
  });
});
