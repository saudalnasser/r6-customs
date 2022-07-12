import { Model, model, Schema, Types } from 'mongoose';

export interface IPlayer {
  _id?: Types.ObjectId;
  discordId: string;
  uplayId: string;
}

const schema: Schema<IPlayer> = new Schema<IPlayer>({
  discordId: { type: String, required: true },
  uplayId: { type: String, required: true },
});

const Player: Model<IPlayer> = model<IPlayer>('Player', schema);

export default Player;
