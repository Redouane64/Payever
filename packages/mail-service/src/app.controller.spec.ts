import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import DailySalesMailTemplate, {
  DailySalesReport,
} from './templates/daily-sales-report.interface';
import { RmqContext } from '@nestjs/microservices';
import { MailingService } from './mailing/mailing.service';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

jest.mock('./templates/daily-sales-report.interface', () => {
  const originalModule = jest.requireActual(
    './templates/daily-sales-report.interface',
  );

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(),
  };
});

describe('InvoiceController', () => {
  let controller: AppController;
  const fakeMailService = {
    send: jest.fn(),
  };

  const fakeConfigService = {
    get: jest.fn(),
  };

  const ctx: RmqContext = {
    getMessage: jest.fn(),
    getChannelRef: jest.fn(),
  } as any;

  const channelRef = { ack: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: MailingService, useValue: fakeMailService },
        { provide: ConfigService, useValue: fakeConfigService },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should process daily sales report event', async () => {
    const message: DailySalesReport = {
      date: new Date().toDateString(),
      totalSales: 300,
      soldItems: [
        {
          sku: 'PRD100',
          qt: 1,
        },
      ],
    };

    jest.spyOn(ctx, 'getChannelRef').mockImplementationOnce(() => channelRef);
    jest.spyOn(ctx, 'getMessage').mockImplementationOnce(() => message);
    jest.spyOn(fakeConfigService, 'get').mockImplementation(() => ({
      reportTo: faker.internet.email(),
    }));

    await controller.onSalesReport(message, ctx);

    expect(DailySalesMailTemplate).toHaveBeenCalled();
    expect(ctx.getChannelRef).toHaveBeenCalledTimes(1);
    expect(ctx.getMessage).toHaveBeenCalledTimes(1);
    expect(channelRef.ack).toHaveBeenCalledWith(message);
  });
});
