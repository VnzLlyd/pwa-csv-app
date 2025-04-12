import Dexie, { Table } from 'dexie';

export interface CSVRow {
  id?: number;
  [key: string]: string | number | undefined;
}

export class CSVDatabase extends Dexie {
  csvData!: Table<CSVRow>;

  constructor() {
    super('CSVDatabase');
    this.version(1).stores({
      csvData: '++id'  // Only using autoincrementing id as the primary key
    });
  }
}

export const db = new CSVDatabase(); 