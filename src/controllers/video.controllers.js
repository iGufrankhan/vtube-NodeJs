import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import { ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    
      const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    if (!userId || !mongoose.Types.ObjectId.isValid(userId.toString())) {
        throw new ApiError(400, "Invalid User ID");
    }
    const aggregate = Video.aggregate([
        {
        $sort: {
            [sortBy]: sortType === "asc" ? 1 : -1,
        },
        },
    ]);

    const fetchedVideos = await Video.aggregatePaginate(aggregate, {
        limit: Number(limit),
        page: Number(page),
    });

    return res
        .status(200)
        .json(
        new ApiResponse(200, fetchedVideos, "Videos fetched successfully...")
        );
    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const userId=req.user?.id
    if(!userId) throw new ApiErrors(401,"User not authenticated")
    if (!title?.trim() || !description?.trim()) {
        throw new ApiErrors(400, "Title and description are required");
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }   
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiErrors(400, "Video file and thumbnail are required");
    }
    const videoFile = req.files.videoFile[0]
    const thumbnailFile = req.files.thumbnail[0]
    //upload 
    const uploadedVideo = await uploadOnCloudinary(videoFile.path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path)
    if(!uploadedVideo?.secure_url || !uploadedThumbnail?.secure_url) {
        throw new ApiErrors(500, "Failed to upload video or thumbnail");
    }
    const newVideo = await Video.create({
        title: title.trim(),
        description: description.trim(),    
        thumbnail: uploadedThumbnail.secure_url,
        videoUrl: uploadedVideo.secure_url,
        owner: userId,
        duration: uploadedVideo.duration || 0,  
    })
    if(!newVideo) {
        throw new ApiErrors(500, "Failed to publish video");
    }
    return res.status(201).json(new ApiResponse(201,"Video published successfully",newVideo))

  
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const userId=req.user?.id
    if(!videoId||!mongoose.Types.ObjectId.isValid(videoId)){        
        throw new ApiErrors(400,"Invalid video id")  
    }
    
    const videodetails=await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {  
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as:"videos",
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $project: { 
                title: 1,
                description: 1,
                thumbnail: 1,   
                videoUrl: 1,
                isPublished: 1,
                duration: 1,
            
            }
        }
    ])

    if(!videodetails || videodetails.length===0){
        throw new ApiErrors(404,"Video not found")
    }       

    return res.status(200).json(new ApiResponse(200,"Video fetched successfully",videodetails[0]));   
})

const updateVideo = asyncHandler(async (req, res) => {
     //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params
    const { title, description, thumbnail } = req.body
   
    if(!videoId||!mongoose.Types.ObjectId.isValid(videoId)){        
        throw new ApiErrors(400,"Invalid video id")  
    }

       if (!title.trim() || !description.trim() || !thumbnail.trim()) {
        throw new ApiErrors(400, "All fields are required");
    }

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "Invalid video ID");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { title, description, thumbnail },
        { new: true }
    ).select("title description thumbnail");

    if (!updatedVideo) {
        throw new ApiErrors(404, "Video not found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(200, "Video details updated successfully", updatedVideo)
        );

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const userId=req.user?.id

    if(!videoId||!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiErrors(400,"Invalid video id")
    }
 
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiErrors(404,"Video not found")
    }   
    if(video.owner.toString()!==userId){
        throw new ApiErrors(403,"You are not authorized to delete this video")
    }
   const deletedVideo =await Video.findByIdAndDelete(videoId)
   if(!deletedVideo){
    throw new ApiErrors(500,"Failed to delete video")
   }

    return res.status(200).json(new ApiResponse(200,"Video deleted successfully",{}))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     if(!videoId||!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiErrors(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiErrors(404,"Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(new ApiResponse(200,"Video publish status updated successfully",video))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}