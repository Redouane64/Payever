import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';
import { Invoice } from './interfaces';
import * as crypto from 'node:crypto';

@Injectable()
export class InvoiceService {
  private readonly store: Invoice[] = [];

  create(data: CreateInvoiceDto) {
    const len = this.store.push({ ...data, id: crypto.randomUUID() });
    return this.store[len - 1];
  }

  findAll(filter: InvoiceFilter) {
    return this.store;
  }

  findInvoiceById(id: string) {
    return this.store.find((i) => i.id === id);
  }
}
