import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["alumni", "admin", "perusahaan"], default: "alumni" },
  resetToken: { type: String },
  resetExpire: { type: Date },
  fotoProfile: { type: String, default: "" },
  noTelp: { type: String },
  cv: { type: String },
}, { timestamps: true });

// Hash password sebelum menyimpan User
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  next();
});

// Method untuk membandingkan password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("user", UserSchema);
export default User;
