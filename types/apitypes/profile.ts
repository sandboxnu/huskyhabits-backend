import { Schema } from 'mongoose';
import { JSONSchemaType } from 'ajv';

// Type returned when making a GET request to profile api
export interface GETProfile {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
}

// Type given to profile api in POST profile requests
export interface POSTCreateProfile {
  username: string;
  bio?: string;
}

// Type given to profile api in PATCH profile requests
export interface PATCHProfile {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
}

// AJV schema to validate POSTCreateProfile objects
export const POSTCreateProfileSchema: JSONSchemaType<POSTCreateProfile> = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    bio: { type: 'string', nullable: true },
  },
  required: ['username'],
};

// AJV schema to validate PATCHProfile objects
export const PATCHProfileSchema: JSONSchemaType<PATCHProfile> = {
  type: 'object',
  properties: {
    first_name: { type: 'string', nullable: true },
    last_name: { type: 'string', nullable: true },
    username: { type: 'string', nullable: true },
    bio: { type: 'string', nullable: true },
  },
  additionalProperties: false,
};
