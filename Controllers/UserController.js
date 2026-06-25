import User from "../Models/User.js";
import Token from '../Models/Token.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import jwtoken from '../Config/EnvVar.js'
import crypto from 'crypto'

const Registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ status: 'false', message: "Email is already registered" });

        const user = new User({ name, email, password });
        await user.save();

        return res.status(201).json({ status: true, message: "User is registered successfully....", data: user });

    } catch (e) {
        console.log(`Error in Registration from Usercontroller : ${e}`);

        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }

        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", data: e.stack || e });

    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ error: "Entered email does not exists." });

        const matching = await bcrypt.compare(password, user.password);
        if (!matching) return res.status(400).json({ message: "Invalid Credentials." });

        const jti = crypto.randomUUID();

        const token = jwt.sign(
            { id: user._id, email: user.email, jti },
            jwtoken.jwtToken,
            { expiresIn: '1h' }
        );

        await Token.create({
            user_id: user._id,
            jti,
            name: req.body.device_name || "default",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });

        return res.status(200).json({ status: true, message: "User is Login successfully.", token });
    } catch (e) {
        console.log(`Error in Login from Usercontroller : ${e}`);

        if (e.name === "ValidationError") {
            const errors = Object.values(e.errors).map((err) => err.message);
            return res.status(422).json({ status: false, error: errors });
        }

        return res.status(500).json({ status: false, error: "oops!something went wrong on server...", data: e.stack || e });
    }
}


export default {
    Registration,
    Login
}