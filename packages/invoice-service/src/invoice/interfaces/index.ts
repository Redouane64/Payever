import { IsNotEmpty, IsPositive } from 'class-validator';

export class InvoiceItem {
  @IsNotEmpty()
  sku: string;

  @IsPositive()
  qt: number;
}

export interface IInvoice {
  customer: string;
  amount: number;
  reference: string;
  date: Date;
  items: InvoiceItem[];
}
