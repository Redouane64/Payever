import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = app.get(getConnectionToken());
  });

  describe('Create Invoice', () => {
    it('should create invoice', () => {
      const fakeInvoice = {
        customer: faker.person.firstName(),
        date: faker.date.future().toISOString(),
        reference: `INV-${faker.number.int({ min: 100, max: 999 })}`,
        amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        items: [
          {
            sku: `PR${faker.number.int({ min: 100, max: 999 })}`,
            qt: faker.number.int({ min: 1, max: 10 }),
          },
        ],
      };
      return request(app.getHttpServer())
        .post('/invoices')
        .send(fakeInvoice)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBeDefined();
          expect(res.body.customer).toBe(fakeInvoice.customer);
          expect(res.body.date).toBe(fakeInvoice.date);
          expect(res.body.reference).toBe(fakeInvoice.reference);
          expect(res.body.amount).toBe(fakeInvoice.amount);
          expect(res.body.items).toEqual(fakeInvoice.items);
        });
    });

    it('should return validation error for invalid invoice', () => {
      const invalidInvoice = {
        customer: '',
        date: 'invalid-date',
        reference: '',
        amount: -10,
        items: [],
      };
      return request(app.getHttpServer())
        .post('/invoices')
        .send(invalidInvoice)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
          expect(res.body.error).toBe('Bad Request');
        });
    });

    afterEach(async () => {
      const collections = connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    });
  });

  describe('Retrieve Invoices', () => {
    it('should retrieve invoice by id', async () => {
      // Create a test invoice
      const fakeInvoice = {
        customer: faker.person.firstName(),
        date: faker.date.future().toISOString(),
        reference: `INV-${faker.number.int({ min: 100, max: 999 })}`,
        amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        items: [
          {
            sku: `PR${faker.number.int({ min: 100, max: 999 })}`,
            qt: faker.number.int({ min: 1, max: 10 }),
          },
        ],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/invoices')
        .send(fakeInvoice);

      const invoiceId = createResponse.body.id;

      // Test retrieving the created invoice
      return request(app.getHttpServer())
        .get(`/invoices/${invoiceId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(invoiceId);
          expect(res.body.customer).toBe(fakeInvoice.customer);
          expect(res.body.date).toBe(fakeInvoice.date);
          expect(res.body.reference).toBe(fakeInvoice.reference);
          expect(res.body.amount).toBe(fakeInvoice.amount);
          expect(res.body.items).toEqual(fakeInvoice.items);
        });
    });

    it('should return 404 for non-existent invoice', () => {
      const nonExistentId = faker.database.mongodbObjectId();
      return request(app.getHttpServer())
        .get(`/invoices/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('invoice_not_found');
          expect(res.body.error).toBe('Not Found');
        });
    });

    it('should retrieve all invoices', async () => {
      // Create multiple test invoices
      const fakeInvoices = Array.from({ length: 3 }, () => ({
        customer: faker.person.firstName(),
        date: faker.date.past().toISOString(),
        reference: `INV-${faker.number.int({ min: 100, max: 999 })}`,
        amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        items: [
          {
            sku: `PR${faker.number.int({ min: 100, max: 999 })}`,
            qt: faker.number.int({ min: 1, max: 10 }),
          },
        ],
      }));

      for (const invoice of fakeInvoices) {
        await request(app.getHttpServer()).post('/invoices').send(invoice);
      }

      // Test retrieving all invoices
      return request(app.getHttpServer())
        .get('/invoices')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(fakeInvoices.length);

          // Check if all created invoices are present in the response
          fakeInvoices.forEach((fakeInvoice) => {
            const foundInvoice = res.body.find(
              (invoice) => invoice.reference === fakeInvoice.reference,
            );
            expect(foundInvoice).toBeDefined();
            expect(foundInvoice.customer).toBe(fakeInvoice.customer);
            expect(foundInvoice.date).toBe(fakeInvoice.date);
            expect(foundInvoice.amount).toBe(fakeInvoice.amount);
            expect(foundInvoice.items).toEqual(fakeInvoice.items);
          });
        });
    });

    it('should retrieve invoices within date range', async () => {
      const baseDate = new Date();
      const fakeInvoices = [
        {
          date: new Date(baseDate.getTime() - 24 * 3600 * 1000 * 1),
        },
        {
          date: new Date(baseDate.getTime() - 24 * 3600 * 1000 * 2),
        },
        {
          date: new Date(baseDate.getTime() - 24 * 3600 * 1000 * 3),
        },
      ].map(({ date }) => ({
        customer: faker.person.firstName(),
        date,
        reference: `INV-${faker.number.int({ min: 100, max: 999 })}`,
        amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        items: [
          {
            sku: `PR${faker.number.int({ min: 100, max: 999 })}`,
            qt: faker.number.int({ min: 1, max: 10 }),
          },
        ],
      }));

      for (const invoice of fakeInvoices) {
        await request(app.getHttpServer()).post('/invoices').send(invoice);
      }

      const fromDate = new Date(
        baseDate.getTime() - 24 * 3600 * 1000 * 1,
      ).toISOString();
      const toDate = new Date().toISOString();

      return request(app.getHttpServer())
        .get(`/invoices?from=${fromDate}&to=${toDate}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          res.body.forEach((invoice) => {
            expect(Date.parse(invoice.date)).toBeGreaterThanOrEqual(
              new Date(fromDate).getTime(),
            );
            expect(Date.parse(invoice.date)).toBeLessThanOrEqual(
              new Date(toDate).getTime(),
            );
          });
        });
    });

    afterEach(async () => {
      const collections = Object.entries(connection.collections);
      for (const entry of collections) {
        const [, collection] = entry;
        await collection.deleteMany({});
      }
    });
  });
});
