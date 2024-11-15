import mongoose, { Model, Schema } from 'mongoose';
import pointSchema from './helpers/PointSchema';

export interface UsersType {
	name: string;
	email: string;
	cpf: string;

	cep: string;
	location: any;

	experience: number;

	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

const usersSchema = new Schema<UsersType>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	cpf: { type: String, required: true, unique: true },

	cep: { type: String, required: true },
	location: {
		type: pointSchema,
		index: '2dsphere',
	},

	experience: { type: Number, default: 0, min: 0 },

	passwordHash: { type: String, required: true },

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

usersSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const Users =
	mongoose.models.Users || mongoose.model<UsersType>('Users', usersSchema);

export default Users as Model<UsersType>;
