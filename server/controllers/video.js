import Video from "../models/Video.js";
import { createError } from "../error.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({
        userId: req.user.id,
        ...req.body
    });
    try {
        const saveVideo = await newVideo.save();
        res.status(200).json(saveVideo);
    } catch (err) {
        next(err);
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "You can update only your video"));
        }
    } catch (err) {
        next(err);
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(
                req.params.id,
            );
            res.status(200).json("The video has been deleted!");
        } else {
            return next(createError(403, "You can delete only your video!"));
        }
    } catch (err) {
        next(err);
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        // 发送给客户端的数据，express的语法
        res.status(200).json(video)
    } catch (err) {
        next(err);
    }
}

export const addView = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id,
            {
                $inc: { views: 1 }
            });
        res.status(200).json("The view has been increased")
    } catch (err) {
        next(err);
    }
}
export const random = async (req, res, next) => {
    try {
        // mongodb奇怪的方法
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
}
export const trend = async (req, res, next) => {
    try {
        // sort也是mongodb的方法，-1是最受欢迎的，1是最不受欢迎的
        const videos = await Video.find().sort({ views: -1 });
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}
export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        // we are finding all those channels instead of one channel. So we use Promise here instead of await
        const list = await Promise.all(
            subscribedChannels.map(channelId => {
                return Video.find({ userId: channelId })
            })
        );
        // return these list
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        next(err);
    }
}

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(',');
    console.log(tags);
    try {
        // $in to check if the tags inside the array
        // limit only fetch 20 not all;
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        // 单独页面，所以40ok
        // regex就是正则匹配，模糊查询，i就是配置项，不分大小写的查询，都是mgdb的语法
        const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).limit(40);
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}