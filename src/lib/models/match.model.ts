import { IPlayer } from './player.model';
import { Model, model, models, Schema, Types } from 'mongoose';
import Maps from '../types/maps.enum';

export type MatchState = 'ongoing' | 'resolved';

export type Winner = 'teamA' | 'teamB';

export interface IMatch {
  _id?: Types.ObjectId;
  teamA: Types.Array<IPlayer>;
  teamB: Types.Array<IPlayer>;
  host: IPlayer;
  map: Maps;
  state: MatchState;
  winner?: Winner;
  timestamps: { createdAt: Date; resolvedAt?: Date };
}

const schema: Schema<IMatch> = new Schema<IMatch>({
  teamA: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
  teamB: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
  host: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  map: { type: String, enum: Object.values(Maps), require: true },
  state: { type: String, require: true },
  winner: { type: String },
  timestamps: {
    createdAt: { type: Date, require: true },
    resolvedAt: { type: Date },
  },
});

export const Match: Model<IMatch> = models.Match || model<IMatch>('Match', schema);
