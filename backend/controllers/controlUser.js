import { createError } from '../error.js';
import Video from '../modals/Video.js'
import User from '../modals/User.js';


export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                }, {
                new: true
            }
            )
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).send("Internal server error");
        }
    } else {
        return next(createError(403, "You are not authenticated!"))
    }
}
export const deleteUser = async (req, res) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User deleted");
        } catch (err) {
            res.status(500).send("Internal server error");
        }
    } else {
        return next(createError(403, "You are not authenticated!"))
    }
}
export const get = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user);
    } catch (error) {
        res.status(404).send("User not Found");
    }
}
export const subscribe = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push : { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc : { subscribers : 1}
        })
        res.status(200).send("Subscription successfull");
    } catch (error) {
        next(createError(403, "You are not authenticated!"))
    }
}
export const unsubscribe = async (req, res) => { 
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull : { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc : { subscribers : -1}
        })
        res.status(200).send("Unsubscription successfull");
    } catch (error) {
        next(createError(403, "You are not authenticated!"))
    }
}
export const like = async (req, res) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes : id},
            $pull:{dislikes : id}
        })
        res.status(200).json("You liked this video")
    } catch (error) {
        next(err)
    }
}
export const dislike = async (req, res) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes : id},
            $pull:{likes : id}
        })
        res.status(200).json("You disliked this video")
    } catch (error) {
        next(err)
    }
}