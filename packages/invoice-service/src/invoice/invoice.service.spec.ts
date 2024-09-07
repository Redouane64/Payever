import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceFilter } from './dtos';
import { Invoice } from './schemas/invoice.schema';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const invoiceModel = {
    create: jest.fn((args) => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toJSON: jest.fn((_) => args),
    })),
    find: jest.fn(() => invoiceModel),
    findById: jest.fn(() => invoiceModel),
    aggregate: jest.fn(() => invoiceModel),
    exec: jest.fn(),
  };

  const fakeInvoice = {
    customer: faker.person.fullName(),
    date: faker.date.past(),
    amount: faker.number.int({ min: 100, max: 1_000 }),
    reference: faker.string.alphanumeric({ length: 6 }),
    items: [
      {
        sku: faker.string.alphanumeric({ length: 6 }),
        qt: faker.number.int({ min: 1 }),
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: invoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create invoice', async () => {
      const inputInvoice = fakeInvoice;

      const expectedInvoice = inputInvoice;
      const createdInvoice = await service.create(inputInvoice);

      expect(createdInvoice).toBe(expectedInvoice);
      expect(invoiceModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should find all invoices', async () => {
      jest.spyOn(invoiceModel, 'exec').mockResolvedValueOnce([fakeInvoice]);

      const inputFilter: InvoiceFilter = {
        from: new Date(new Date().getTime() - 3_600_000 * 24),
        to: new Date(),
      };
      const expectedInvoices = [fakeInvoice];

      const invoices = await service.findAll(inputFilter);

      expect(invoices).toStrictEqual(expectedInvoices);
    });
  });

  describe('findById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should find invoice', async () => {
      const inputId = faker.database.mongodbObjectId();
      const expectedInvoice = {
        id: inputId,
        ...fakeInvoice,
      };
      jest
        .spyOn(invoiceModel, 'exec')
        .mockImplementationOnce(() => expectedInvoice);

      const invoice = await service.findInvoiceById(inputId);
      expect(invoice).toStrictEqual(expectedInvoice);
      expect(invoiceModel.findById).toHaveBeenCalledTimes(1);
      expect(invoiceModel.exec).toHaveBeenCalledTimes(1);
    });

    it('should throw invoice_not_found error', async () => {
      const inputId = faker.database.mongodbObjectId();
      jest.spyOn(invoiceModel, 'exec').mockImplementationOnce(() => null);

      const call = service.findInvoiceById(inputId);

      expect(call).rejects.toThrow('invoice_not_found');
      expect(invoiceModel.findById).toHaveBeenCalledTimes(1);
      expect(invoiceModel.exec).toHaveBeenCalledTimes(1);
    });
  });
});
