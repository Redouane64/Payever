import { Test, TestingModule } from '@nestjs/testing';
import { ReportingService } from './reporting.service';
import { InvoiceService } from '../invoice/invoice.service';
import { MAIL_CLIENT_NAME } from './rmq-client';

describe('ReportingService', () => {
  let service: ReportingService;

  const mockInvoiceService = {};
  const mockMailClient = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportingService,
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
        {
          provide: MAIL_CLIENT_NAME,
          useValue: mockMailClient,
        },
      ],
    }).compile();

    service = module.get<ReportingService>(ReportingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
