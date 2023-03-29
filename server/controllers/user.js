import { createError } from "../error.js"
import User from "../models/User.js"

export const update = async (req, res, next) => {
    // req.params.id -> "/:id"; req.user.id -> verifyToken
    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body
                },
                // return the newest version of user
                { new: true }
            )
            res.status(200).json(updateUser);
        } catch (err) {
            // 传给index里面的err
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your account!"))
    }
}
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            // findByIdAndDelete mongodb methods -> more convinient
            const updateUser = await User.findByIdAndDelete(req.params.id,
                {
                    $set: req.body
                },
                // return the newest version of user
                { new: true }
            )
            res.status(200).json("User has been deleted.");
        } catch (err) {
            // 传给index里面的err
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your account!"))
    }
}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}
export const subscribe = async (req, res, next) => {
    try {
        // req.user.id -> our user(follower); req.params.id -> influencer
        await User.findByIdAndUpdate(req.user.id, {
            // mongodb的方法
            $push: { subscribedUsers: req.params.id }
        })

        await User.findByIdAndUpdate(req.params.id, {
            // $inc递增方法
            $inc: { subscribers: 1 }
        })
        res.status(200).json("Subscribe successfully.")
    } catch (err) {
        next(err);
    }
}
export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            // mongodb的方法
            $pull: { subscribedUsers: req.params.id }
        })

        await User.findByIdAndUpdate(req.params.id, {
            // $inc递增方法
            $inc: { subscribers: -1 }
        })
        res.status(200).json("Unsubscribe successfully.")
    } catch (err) {
        next(err);
    }
}
export const like = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}
export const dislike = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}
