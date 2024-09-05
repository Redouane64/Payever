import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';
import { InvoiceService } from './invoice.service';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body(ValidationPipe) data: CreateInvoiceDto) {
    return this.invoiceService.create(data);
  }

  @Get()
  findAll(@Query(ValidationPipe) filter: InvoiceFilter) {
    return this.invoiceService.findAll(filter);
  }

  @Get(':id')
  findById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.invoiceService.findInvoiceById(id);
  }
}
