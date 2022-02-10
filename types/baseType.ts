// Base Type for all Schema that enables soft-deletes for data recovery
export interface IBaseType {
  deleted: boolean;
  date_deleted: Date;
  schema_version: number;
}
