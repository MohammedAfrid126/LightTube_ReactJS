import { createError } from '../error.js';
import User from '../modals/User.js';
import Video from '../modals/Video.js'

export const addVideo = async (req,res,next)=>{
    const newVideo = new Video({userId :  req.user.id, ...req.body})
    try {
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    } catch (err) {
        next(err);
    }
}
export const updateVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id)
        if(!video) return createError(404,"Video not found")
        if (req.body.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
                $set : req.body,
            },{
                new : true
            });
            res.status(200).json(updatedVideo)
        }else{
            res.status(403).send("You are not authorized")
        }
    } catch (err) {
        next(err);
    }
}
export const deleteVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id)
        if(!video) return createError(404,"Video not found")
        if (req.body.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id)
            res.send(200).send("The Video has been deleted")
        }else{
            res.status(403).send("You are not authorized")
        }
    } catch (err) {
        next(err);
    }
}

export const getVideo = async (req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (err) {
        next(err);
    }
}
export const addView = async (req,res,next)=>{
    try {
        await Video.findByIdAndUpdate(req.params.id,{
            $inc : {views : 1}
        })
        res.status(200).json("The view has been increased")
    } catch (err) {
        next(err);
    }
}
export const randomVideo = async (req,res,next)=>{
    try {
        const videos = await Video.aggregate([{$sample : {size : 10}}]);
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}
export const trend = async (req,res,next)=>{
    try {
        const videos = await Video.find().sort({views : -1})
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}
export const subscribedVideo = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map((channelId)=>{
                return Video.find({
                    userId : channelId
                })
            })
        )
        res.status(200).json(list.flat().sort((a,b)=> b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
}

export const getByTag = async (req,res,next)=>{
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({tags : {$in : tags} }).limit(20)
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}

export const getBySearch = async (req,res,next)=>{
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: {$regex : query, $options : "i" },
        }).limit(40)
        res.status(200).json(videos)
    } catch (err) {
        next(err);
    }
}