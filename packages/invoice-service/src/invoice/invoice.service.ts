import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';
import { Model, RootFilterQuery } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { InjectModel } from '@nestjs/mongoose';

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
}
