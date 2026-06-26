import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate:{
        validator: function(value){
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: (prop) => `${prop.value} is not a valid email address`
    } },
    password: { type: String, required: true },
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});


export default mongoose.model('User', userSchema, 'users');