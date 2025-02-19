import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/types";

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.models.user || mongoose.model("User", UserSchema);

export default User;
