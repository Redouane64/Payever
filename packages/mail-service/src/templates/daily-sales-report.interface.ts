import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface DailySalesReport {
  totalSales: number;
  date: string;
  soldItems: Array<{
    sku: string;
    qt: number;
  }>;
}

const templateFile = readFileSync(
  join(__dirname, 'daily-sales-report.template.hbs'),
  {
    encoding: 'utf8',
  },
);

export default Handlebars.compile(templateFile);
