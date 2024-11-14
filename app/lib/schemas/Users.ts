import mongoose, { Model, Schema } from 'mongoose';

interface UsersType {
	name: string;
	email: string;
	cpf: string;

	location: any;

	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		required: true,
	},
	// Coordinates must be stored in [longitude, latitude] order
	coordinates: {
		type: [Number],
		required: true,
	},
});

const usersSchema = new Schema<UsersType>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		cpf: { type: String, required: true, unique: true },

		location: {
			type: pointSchema,
			index: '2dsphere',
		},

		passwordHash: { type: String, required: true },

		createdAt: { type: Date, default: () => Date.now(), immutable: true },
		updatedAt: { type: Date, default: () => Date.now() },
	}
	// { autoIndex: true }
);

usersSchema.pre('validate', function (next) {
	this.updatedAt = new Date();
	next();
});

const Users =
	mongoose.models.Users || mongoose.model<UsersType>('Users', usersSchema);

export default Users as Model<UsersType>;
