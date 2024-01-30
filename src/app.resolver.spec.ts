import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { Request } from 'express';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let resolver: AppResolver;
  let appService: AppService;
  const expectedUrl = 'http://localhost:3001';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useValue: {
            getBaseUrl: jest.fn().mockReturnValue(expectedUrl),
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    appService = module.get<AppService>(AppService);
  });

  describe('getBaseUrl', () => {
    it('should return the message from appService', () => {
      const req: Request = {} as Request;
      const context = { req };
      jest.spyOn(appService, 'getBaseUrl').mockReturnValue(expectedUrl);
      const result = resolver.getBaseUrl(context);

      expect(result).toBe('http://localhost:3001');
      expect(appService.getBaseUrl).toHaveBeenCalledWith(context.req);
    });
  });
});
