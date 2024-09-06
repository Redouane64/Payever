import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';
import { Model, RootFilterQuery } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DailySalesReport } from '../reporting/interfaces';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoices: Model<Invoice>,
  ) {}

  async create(data: CreateInvoiceDto) {
    const doc = await this.invoices.create(data);
    const invoice = doc.toJSON();
    delete invoice['__v'];
    return invoice;
  }

  async findAll(filter: InvoiceFilter) {
    const findOptions: RootFilterQuery<Invoice> = {
      date: {
        $lte: new Date(),
      },
    };

    if (filter.from) {
      findOptions.date.$gte = filter.from;
    }
    if (filter.to) {
      findOptions.date.$lte = filter.to;
    }

    const invoices = await this.invoices
      .find(
        {
          ...findOptions,
        },
        { __v: 0 },
        { lean: true },
      )
      .exec();
    return invoices;
  }

  async findInvoiceById(id: string) {
    const document = await this.invoices.findById(id, { __v: 0 }).exec();

    if (!document) {
      throw new NotFoundException('Invoice not found');
    }

    return document;
  }

  async getDailyReport(): Promise<DailySalesReport> {
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 3600 * 1000);

    const soldItems = await this.invoices
      .aggregate<{ sku: string; qt: number }>([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          // Unwind the items array to separate each item
          $unwind: '$items',
        },
        {
          // Group by SKU and calculate total qt per SKU
          $group: {
            _id: '$items.sku',
            qt: { $sum: '$items.qt' },
          },
        },
        {
          // Project final output structure
          $project: {
            _id: 0,
            sku: '$_id',
            qt: 1,
          },
        },
      ])
      .exec();

    const [summary = { totalSales: 0 }] = await this.invoices
      .aggregate<{ totalSales: number }>([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: '$amount',
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();

    return {
      date: new Date().toDateString(),
      soldItems,
      totalSales: summary.totalSales,
    };
  }
}
