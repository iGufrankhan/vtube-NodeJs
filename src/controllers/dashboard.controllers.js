import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiErrors } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const channelDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "Video", 
        localField: "_id",
        foreignField: "owner",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "Like",
              localField: "_id",
              foreignField: "video",
              as: "likes"
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "Subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $addFields: {
        totalVideos: { $size: "$videos" },
        totalSubscribers: { $size: "$subscribers" },
        totalViews: { $sum: "$videos.views" },
        totalLikes: {
          $sum: {
            $map: {
              input: "$videos",
              as: "video",
              in: { $size: "$$video.likes" }
            }
          }
        }
      }
    },
    {
      $project: {
        totalVideos: 1,
        totalSubscribers: 1,
        totalViews: 1,
        totalLikes: 1
      }
    }
  ]);

  if (!channelDetails.length) {
    throw new ApiErrors(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channelDetails[0], "Channel stats fetched"));
});


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;
    const videos = await Video.find({ owner: userId }).populate('owner', 'username email');
    if (!videos) {
        throw new ApiErrors(400, "No videos found for this channel");
    }
    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"));



})

export {
    getChannelStats, 
    getChannelVideos
    }