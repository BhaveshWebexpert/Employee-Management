import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
    user_id : {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true },
    jti : {type : String, required: true, unique: true},
    lastusedAt : {type: Date, default: null},
    expiresAt : {type: Date, required : true}
}, {timestamps: true});

export default mongoose.model('Token', tokenSchema, 'tokens');