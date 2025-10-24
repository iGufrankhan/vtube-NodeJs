import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

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
    const userId=req.user?._id
    //TODO: toggle like on tweet

    if(!tweetId||!mongoose.Types.isValidObjectId(tweetId))
    {
        throw new ApiErrors(400,"invalid tweetid")
    }

    const existedTweetlike=await Like.findOne({
        tweet:tweetId,
        likedBy:userId
    })
   
    if(existedTweetlike)
    {
        await Like.findBidandDelete(
            {
                tweet:tweetId,
                likedBy:userId

        })

        return res.status(200).json(new ApiResponse(201,"unliked the tweet"),existedTweetlike)
    }

    const newlike=await Like.create(
        {
            tweet:tweetId,
            likedBy:userId
        }
    )
   

    return res.status(200).json(new ApiResponse(200,"succeessfullt liked"),newlike);



}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const {userId}=req.user?._id
    const new_id=new mongoose.Types.ObjectId(userId);

      const likedVideoDetails = await Like.aggregate([
    {
      $match: {
        likedBy: new_id,
      },
    },
    {
      $lookup: {
        from: "Video",
        foreignField: "_id",
        localField: "video",
        as: "likeVideoData",
      },
    },
    {
      $unwind: "$likeVideoData",
    },
    {
      $project: {
        _id: 0,
        video: "$likeVideoData",
      },
    },
  ]);

  console.log("liked videos :", likedVideoDetails);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "fetched liked videos successfully",
        likedVideoDetails
      )
    );
})
   





export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}