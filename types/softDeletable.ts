import { IBaseType } from './baseType';

// Base type for some schema that will be soft-deletable for data recovery
export interface ISoftDeletable extends IBaseType {
  deleted: boolean;
  date_deleted: Date;
}
