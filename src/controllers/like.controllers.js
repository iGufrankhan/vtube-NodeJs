import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
     const userId = req.user.id;
    //TODO: toggle like on video
    if(!videoId||!mongoose.Types.isValidObjectId.isValid(videoId))
    {
        throw new ApiErrors(400,"invalid videoid")
    }

    const existedlike=await Like.findOne(
        {
            video:videoId,
            likedBy:userId

        }
    );

    if(existedlike)
    {
       await Like.findBidandDelete(existedlike._id);
       return res.status(200).json(new ApiResponse(200,"video Unliked"),existedlike)

    }

    const newlike= await Like.create(
        {
            video:videoId,
            likedBy:userId
        }
    )

    return res.status(200).json(new ApiResponse(200,"like the video"),newlike)


})




const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Validate commentId
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    // Check if like already exists
    const existedLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    // If already liked, unlike it
    if (existedLike) {
        await Like.findByIdAndDelete(existedLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, "Comment unliked successfully", existedLike));
    }

    // Otherwise, create a new like
    const newLike = await Like.create({
        comment: commentId,
        likedBy: userId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment liked successfully", newLike));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}