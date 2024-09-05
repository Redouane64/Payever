export interface InvoiceItem {
  sku: string;
  qty: number;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  reference: string;
  date: Date;
  items: InvoiceItem[];
}
