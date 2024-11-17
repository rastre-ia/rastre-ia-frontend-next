import mongoose, { Schema } from 'mongoose';
import RolesEnum from './helpers/RolesEnum';

export interface PoliceStationsSchemaInterface {
	_id?: string;

	name: string;
	email: string;
	passwordHash: string;
	role: RolesEnum;

	createdAt?: Date;
	updatedAt?: Date;
}

const policeStationsSchema = new Schema<PoliceStationsSchemaInterface>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },

	role: {
		type: String,
		enum: Object.values(RolesEnum),
		required: true,
		default: RolesEnum.POLICE_STATION,
		immutable: true,
	},

	createdAt: { type: Date, default: () => Date.now(), immutable: true },
	updatedAt: { type: Date, default: () => Date.now() },
});

policeStationsSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

const PoliceStations =
	mongoose.models.PoliceStations ||
	mongoose.model('PoliceStations', policeStationsSchema);

export default PoliceStations;
