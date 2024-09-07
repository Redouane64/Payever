import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Invoice, InvoiceItem } from '../schemas/invoice.schema';
import { Type } from 'class-transformer';

export class CreateInvoiceDto implements Omit<Invoice, '_id'> {
  @IsNotEmpty()
  customer: string;

  @IsPositive()
  amount: number;

  @IsNotEmpty()
  reference: string;

  @IsDateString()
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItem)
  items: CreateInvoiceItem[];
}

export class CreateInvoiceItem extends InvoiceItem {
  @IsNotEmpty()
  sku: string;

  @IsPositive()
  qt: number;
}

export class InvoiceFilter {
  @IsOptional()
  @IsDateString()
  from?: Date;

  @IsOptional()
  @IsDateString()
  to?: Date;
}
