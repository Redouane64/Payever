import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

export class InvoiceItem {
  @Prop({ type: String, required: true })
  sku: string;

  @Prop({ type: Number, required: true })
  qt: number;
}

@Schema()
export class Invoice {
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
    type: [{ type: InvoiceItem }],
    required: true,
    _id: false,
  })
  items: InvoiceItem[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
