import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js"; 
import { ApiErrors } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { appendFile } from "fs";

// GET all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    // TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiErrors(400, "Invalid video ID...");
    }

    const comment = Comment.aggregate([
        {
            $match: {
                videoId: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $sort: { createdAt: -1 },
        },
    ]);

    const paginate = await Comment.aggregatePaginate(comment, {
        page: parseInt(page),
        limit: parseInt(limit),
    });

    return res
        .status(200)
        .json({
            statusCode: 200,
            message: "Comments fetched successfully",
            data: paginate,
        });
});


// ADD a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; 

    if (!videoId?.trim()) {
        throw new ApiErrors(400, "invalid videoId");
    }

    if (!text?.trim()) {
        throw new ApiErrors(400, "Comment text cannot be empty");
    }
   


    const newComment = await Comment.create({
        video: videoId,
         context:text,
       owner:userId
    });

    if(!newComment)
    {
        throw new ApiErrors(400,"failed to add comment")
    }

    res.status(201).json(
      new ApiResponse(201,"comment add successfully", newComment)
    );
});



// UPDATE a comment
const updateComment = asyncHandler(async (req, res) => {
   const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate commentId
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiErrors(400, "Invalid commentId");
    }

    // Check if comment exists
    const existedComment = await Comment.findById(commentId);
    if (!existedComment) {
        throw new ApiErrors(404, "Comment not found");
    }

    // Check for empty text
    if (!text || !text.length) {
        throw new ApiErrors(400, "Empty text is not allowed");
    }

    // Check ownership (authorization)
    if (existedComment.owner.toString() !== userId.toString()) {
        throw new ApiErrors(403, "You are not authorized to update another user's comment");
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { text },
        { new: true }
    );

    if (!updatedComment) {
        throw new ApiErrors(500, "Failed to update comment");
    }

    // Success response
    return res
        .status(200)
        .json(new ApiResponse(200, "Comment updated successfully", updatedComment));
});

})





// DELETE a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if(!commentId||!mongoose.Types.ObjectId.isValid(commentId))
    {
        throw new  ApiErrors(400,"invalid commentid")
    }

    const existedComment_id=await Comment.findById(commentId);
    if(!existedComment_id)
    {
        throw new ApiErrors(400,"userId not found")
    }
   if (existedComment_id.owner.toString() !== userId.toString()) {
        throw new ApiErrors(403, "You are not authorized to update another user's comment");
    }


  const checkDelete=await  Comment.findByIdAndDelete(commentId)
  if(!checkDelete)
  {
    throw new ApiErrors(400,"failed to delete")
  }

    return 
    res.status(200)
    .json(new ApiResponse(200, "successfully delettion"),{})

  
});







export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
