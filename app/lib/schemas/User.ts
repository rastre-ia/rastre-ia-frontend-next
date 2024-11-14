import mongoose, { Model, Schema } from "mongoose";

interface UsersType {
  name: string;
  email: string;
  role: "Citizen" | "Police" | "Admin";
}

const UsersSchema = new Schema<UsersType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Citizen", "Police", "Admin"],
    default: "Citizen",
  },
});

const Users =
  mongoose.models.Users || mongoose.model<UsersType>("users", UsersSchema);

export default Users as Model<UsersType>;
