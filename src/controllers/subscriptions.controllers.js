import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channel ID
  if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiErrors(400, "Invalid channel ID");
  }

  // Check if subscription already exists
  const existingSub = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id
  });

  // If exists → unsubscribe (delete)
  if (existingSub) {
    await Subscription.findByIdAndDelete(existingSub._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }

  // If not exists → subscribe (create)
  const newSub = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id
  });

  if (!newSub) {
    throw new ApiErrors(500, "Error while toggling subscription");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newSub, "Subscribed successfully"));


})



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

      if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiErrors(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
        {
        $match: {
            channel: new mongoose.Types.ObjectId(channelId),
        },
        },
        {
        $count: "subscriberCount",
        },
    ]);

    return res
        .status(200)
        .json(
        new ApiResponse(200, "Subscriber to channels fetched successfully...", subscribers)
        );




})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    
      if (!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new ApiErrors(400, "Invalid subcsriber ID");
  }

  const subscribers = await Subscription.aggregate([
        {
        $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
        },
        {
        $count: "subscriberCount",
        },
    ]);

    return res
        .status(200)
        .json(
        new ApiResponse(200, "Subscribers fetched successfully...", subscribers)
        );

    


})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}