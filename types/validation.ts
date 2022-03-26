import Ajv from 'ajv';
import { POSTCreateProfileSchema } from './apitypes/profile';
export const ajv = new Ajv();

ajv.addSchema(POSTCreateProfileSchema, 'POSTCreateProfile');
