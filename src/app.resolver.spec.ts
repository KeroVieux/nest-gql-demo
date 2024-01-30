import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { Request } from 'express';
import { AppService } from './app.service';
// Here is a function to extend the Request interface.
export interface RequestWithHeaders extends Request {
  headers: {
    'x-action': string;
  };
}
describe('AppResolver', () => {
  let resolver: AppResolver;
  let appService: AppService;
  const expectedUrl = 'http://localhost:3002';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useValue: {
            getBaseUrl: jest.fn((req: Request) => {
              if (req.headers['x-action'] === 'payment') {
                return 'http://localhost:3001';
              }
              return expectedUrl;
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    appService = module.get<AppService>(AppService);
  });

  describe('getBaseUrl', () => {
    it('should return the message from appService without headers', () => {
      const req: RequestWithHeaders = {
        headers: { 'x-action': 'payment1' },
      } as RequestWithHeaders;
      const context = { req };
      jest.spyOn(appService, 'getBaseUrl');
      const result = resolver.getBaseUrl(context);

      expect(result).toBe('http://localhost:3002');
      expect(appService.getBaseUrl).toHaveBeenCalledWith(context.req);
    });
    it('should return the message from appService with headers', () => {
      const req: RequestWithHeaders = {
        headers: { 'x-action': 'payment' },
      } as RequestWithHeaders;
      const context = { req };
      jest.spyOn(appService, 'getBaseUrl');
      const result = resolver.getBaseUrl(context);

      expect(result).toBe('http://localhost:3001');
      expect(appService.getBaseUrl).toHaveBeenCalledWith(context.req);
    });
  });
});
