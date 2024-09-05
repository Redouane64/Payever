import { Invoice, InvoiceItem } from '../interfaces';

export class CreateInvoiceDto implements Omit<Invoice, 'id'> {
  customer: string;
  amount: number;
  reference: string;
  date: Date;
  items: InvoiceItem[];
}

export interface InvoiceFilter {
  from: Date;
  to: Date;
}
