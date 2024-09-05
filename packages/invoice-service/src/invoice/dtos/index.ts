import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { IInvoice, InvoiceItem } from '../interfaces';
import { Type } from 'class-transformer';

export class CreateInvoiceDto implements Omit<IInvoice, 'id'> {
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
  @Type(() => InvoiceItem)
  items: InvoiceItem[];
}

export class InvoiceFilter {
  @IsOptional()
  @IsDateString()
  from?: Date;

  @IsOptional()
  @IsDateString()
  to?: Date;
}
