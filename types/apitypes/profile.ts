import { Schema } from 'mongoose';
import { JSONSchemaType } from 'ajv';

// Type returned when making a GET request to profile api
export interface GETProfile {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
}

// Type given to profile api in POST requests
export interface POSTCreateProfile {
  user_id: string;
  username: string;
  bio?: string;
}

// AJV schema to validate POSTCreateProfile objects
export const POSTCreateProfileSchema: JSONSchemaType<POSTCreateProfile> = {
  type: 'object',
  properties: {
    user_id: { type: 'string' },
    username: { type: 'string' },
    bio: { type: 'string', nullable: true },
  },
  required: ['user_id', 'username'],
  additionalProperties: false,
};
