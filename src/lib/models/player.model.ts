import { Model, model, models, Schema, Types } from 'mongoose';

export interface IPlayer {
  _id?: Types.ObjectId;
  discordId: string;
  uplayId: string;
}

const schema: Schema<IPlayer> = new Schema<IPlayer>({
  discordId: { type: String, required: true },
  uplayId: { type: String, required: true },
});

export const Player: Model<IPlayer> = models.Player || model<IPlayer>('Player', schema);
