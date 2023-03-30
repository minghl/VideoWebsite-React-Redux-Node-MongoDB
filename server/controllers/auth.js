import mongoose from "mongoose";
import User from "../models/User.js";
// add this repository for hide the passwords
import bcrypt from "bcryptjs";
// 分类别控制error类型
import { createError } from "../error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        // encript the password in case disclosure
        const newUser = new User({ ...req.body, password: hash });

        await newUser.save();
        res.status(200).send("User has been created.")
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    try {
        // mongodb method
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not find"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) return next(createError(400, "Wrong credentials"));

        const token = jwt.sign({ id: user._id }, process.env.JWT);
        // 最好不要把password直接发给用户,并且不要发送无用信息
        const { password, ...others } = user._doc;

        // 把token发给user，用cookie装载
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(others);
    } catch (error) {
        next(error);
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })

            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
            res.cookie("access_token", token, {
                httpOnly: true
            }).status(200).json(savedUser._doc);
        }
    } catch (err) {
        next(err);
    }
}