import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateInvoiceDto, InvoiceFilter } from './dtos';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() data: CreateInvoiceDto) {
    return this.invoiceService.create(data);
  }

  @Get()
  findAll(@Query() filter: InvoiceFilter) {
    return this.invoiceService.findAll(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.invoiceService.findInvoiceById(id);
  }
}
