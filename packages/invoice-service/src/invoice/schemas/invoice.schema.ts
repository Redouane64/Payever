import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IInvoice, InvoiceItem } from '../interfaces';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice implements IInvoice {
  @Prop({
    required: true,
  })
  customer: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
  })
  reference: string;

  @Prop({
    type: Date,
    required: true,
  })
  date: Date;

  @Prop({
    type: [raw({ qt: { type: Number }, sku: { type: String } })],
    required: true,
    _id: false,
  })
  items: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
