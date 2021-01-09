import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	points: number;
}

const userSchema = new Schema({
	name: { type: String, unique: true, required: true },
	points: { type: Number, default: 0, index: true }
});

export default model<IUser>('User', userSchema);
