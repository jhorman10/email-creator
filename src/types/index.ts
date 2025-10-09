export interface ExcelData {
  headers: string[];
  rows: string[][];
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface FieldMapping {
  [placeholder: string]: string; // placeholder -> column name
}

export interface GeneratedEmail {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  rowData: { [key: string]: string };
}