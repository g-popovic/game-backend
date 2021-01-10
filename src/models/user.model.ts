import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	points: number;
}

const userSchema = new Schema(
	{
		name: { type: String, unique: true, required: true },
		points: { type: Number, default: 0, index: true },
		recentGameDates: [Date],
		lastBonusClaim: { type: Date, default: () => new Date() }
	},
	{ versionKey: false }
);

export default model<IUser>('User', userSchema);
