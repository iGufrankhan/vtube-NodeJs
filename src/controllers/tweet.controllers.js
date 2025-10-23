import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
     const userId = req.user?.id;

     if(!userId && !isValidObjectId(userId)){
        throw new ApiErrors(400, "Invalid user id");
     }
     if(!content || content.trim().length === 0){
        throw new ApiErrors(400, "Tweet content cannot be empty");
     }

     try {

        const tweet=await Tweet.create({
            content: content,
            owner: userId
        });
        if(!tweet){
            throw new ApiErrors(500, "Failed to create tweet");
        }
        return res.status(201).json(new ApiResponse(201, "Tweet created successfully", tweet)); 
      
     } catch (error) {
        throw new ApiErrors(500, "Internal server error");
     }




})

const getUserTweets = asyncHandler(async (req, res) => {
    // get user tweets

    const { userId } = req.params;


    if (!userId || !isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user id");
    }

    const tweets = await Tweet.find({ owner: userId }).populate("owner", "username email");

  
    if (!tweets || tweets.length === 0) {
        return res.status(200).json(new ApiResponse(200, "User tweets fetched successfully", []));
    }

    return res.status(200).json(new ApiResponse(200, "User tweets fetched successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params;
    const { content } = req.body;   

    if(!tweetId||mongoose.Types.ObjectId.isValid(tweetId))
    {
        throw new ApiErrors(400,"invalid tweetid")
    }
    if(!content || content.trim().length===0)
    {
        throw new ApiErrors(400,"tweet content cannot be empty")
    }

    const updatetweet=await Tweet.findByIdAndUpdate(
       
            tweetId,
        {
        $set:{content:content},
       
        },
         {new:true}
    )

    if(!updatetweet)
    {
        throw new ApiErrors(500,"failed to update tweet")
    }
    return res.status(200).json(new ApiResponse(200,"tweet updated successfully",updatetweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if(!tweetId||!mongoose.Types.ObjectId.isValid(tweetId))
    {
        throw new ApiErrors(400,"invalid tweetid")
    }

    const deletedTweet=await Tweet.findByIdAndDelete(tweetId);

    if(!deletedTweet)
    {
        throw new ApiErrors(500,"failed to delete tweet")
    }
    return res.status(200).json(new ApiResponse(200,"tweet deleted successfully",deletedTweet))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}