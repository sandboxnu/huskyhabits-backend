import { ITest } from '../types/test';
import { model, Schema } from 'mongoose';

// This Schema corresponds to the ITest document interface.
const testSchema: Schema = new Schema<ITest>(
  {
    title: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<ITest>('Test', testSchema);
