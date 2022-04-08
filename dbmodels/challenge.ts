
import { model, Schema } from 'mongoose';
import { IChallenge } from '../types/dbtypes/challenge';

// A Challenge represents a challenge that a user can create with a specified duration and multiple users can join.
const challengeSchema: Schema = new Schema<IChallenge>(
  {
    challenge_id: { type: Schema.Types.ObjectId, required: true },
    name: String,
    start_date: { type: Date, required: true },
    duration: { type: Number, required: true },
    participants: { type: [Schema.Types.ObjectId], required: true },
    owner: { type: Schema.Types.ObjectId, required: true },
    schema_version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export default model<IChallenge>('Challenge', challengeSchema);
