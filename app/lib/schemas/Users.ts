import mongoose, { Model, Schema } from 'mongoose';
import pointSchema from './helpers/PointSchema';
import RolesEnum from './helpers/RolesEnum';

export interface UsersSchema {
	_id?: Schema.Types.ObjectId;

	name: string;
	email: string;
	cpf: string;
	role: RolesEnum;

	cep: string;
	location: any;

	experience: number;

	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

const usersSchema = new Schema<UsersSchema>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	cpf: { type: String, required: true, unique: true },
	role: {
		type: String,
		enum: Object.values(RolesEnum),
		required: true,
		default: RolesEnum.USER,
		immutable: true,
	},
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
	mongoose.models.Users || mongoose.model<UsersSchema>('Users', usersSchema);

export default Users as Model<UsersSchema>;
