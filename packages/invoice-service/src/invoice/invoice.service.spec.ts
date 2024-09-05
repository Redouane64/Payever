import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Invoice } from './interfaces';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceService],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create invoice', () => {
      const inputInvoice: CreateInvoiceDto = {
        customer: 'John Doe',
        date: new Date(),
        reference: 'INV-100',
        amount: 20,
        items: [{ sku: 'PR101', qty: 1 }],
      };
      const expectedInvoice = inputInvoice;

      const createdInvoice = service.create(inputInvoice);

      expect(createdInvoice).toBe(expectedInvoice);
    });
  });

  describe('findAll', () => {
    it('should find all invoices', () => {
      const inputFilter: InvoiceFilter = {
        from: new Date(new Date().getTime() - 3_600_000 * 24),
        to: new Date(),
      };
      const expectedInvoices: Invoice[] = [];

      const invoices = service.findAll(inputFilter);

      expect(invoices).toStrictEqual(expectedInvoices);
    });
  });

  describe('findById', () => {
    it('should find invoice', () => {
      const inputId = '';
      const expectedInvoice: Invoice = {
        id: '',
        customer: 'John Doe',
        date: new Date(),
        reference: 'INV-100',
        amount: 20,
        items: [{ sku: 'PR101', qty: 1 }],
      };

      const invoices = service.findInvoiceById(inputId);

      expect(invoices).toBe(expectedInvoice);
    });
  });
});
