export interface DailySalesReport {
  totalSales: number;
  date: string;
  soldItems: Array<{
    sku: string;
    qt: number;
  }>;
}
