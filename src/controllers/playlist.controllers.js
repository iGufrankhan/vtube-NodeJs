import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiErrors} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    const userId=req.user?._id

    if(!name.trim()||!description.trim())
    {
        throw new ApiErrors(400,"all filed required")
    }

    const newPlaylist=await Playlist.create({
        name:name,
        description:description,
        owner:userId

    })

     if(!newPlaylist)
     {
        throw new ApiErrors(400,"failed to craete one")
     }

     return res.status(200).json(new ApiResponse(200,"successfully created"),newPlaylist)



    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  
 const {userId} = req.params
    //TODO: get user playlists
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiErrors(400, "Invalid user id...");
    }
    const playlist = await Playlist.find({
        owner: userId,
    });

    if (playlist.length == 0) {
        throw new ApiErrors(404, "No playlist not found...");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "playlists fetched successfully", playlist));

    

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const userId=req.user?._id
      if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiErrors(400, "Invalid user id...");
    }
    
    const playlistByid=await Playlist.findById(playlistId);

    if(!playlistByid)
    {
        throw new ApiErrors(400,"found not a single playlist")
    }

    return res.status(200).json(new ApiResponse(200,"succefully fetchj"),playlistByid)


    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
  throw new ApiErrors(400, "Invalid playlist id...");
}

if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
  throw new ApiErrors(400, "Invalid video id...");
}

const updatePlaylist = await Playlist.findByIdAndUpdate(
  playlistId,
  {
    $push: { videos: videoId }
  },
  { new: true }
);

if (!updatePlaylist) {
  throw new ApiErrors(
    500,
    "Something went wrong while adding video to playlist..."
  );
}

return res
  .status(201)
  .json(
    new ApiResponse(201, updatePlaylist, "Playlist updated successfully")
  );



})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    
    // TODO: remove video from playlist
    const { playlistId, videoId } = req.params;

if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
  throw new ApiErrors(400, "Invalid playlist id...");
}

if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
  throw new ApiErrors(400, "Invalid video id...");
}

const updatePlaylist = await Playlist.findByIdAndUpdate(
  playlistId,
  {
    $pull: { videos: videoId }
  },
  { new: true }
);

if (!updatePlaylist) {
  throw new ApiErrors(
    500,
    "Something went wrong while removing video to playlist..."
  );
}

return res
  .status(201)
  .json(
    new ApiResponse(201, updatePlaylist, "reoved video from playlist")
  );


})



const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete 
     if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiErrors(400, "Invalid user id...");
    }

    const deleteplaylist=await Playlist.findByIdAndDelete(playlistId);
    if(!deleteplaylist)
    {
        throw new ApiErrors(200,"failed delete playlist")
    }

    return res.status(200).json(new ApiResponse(200,"successfully delete the playlist"),{})

})



const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
     if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiErrors(404, "Invalid playlist id...");
    }

    if (!name.trim() || !description.trim()) {
        throw new ApiErrors(400, "All fields are required...");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        {
            new: true,
        }
    );
    if (!updatedPlaylist) {
        throw new ApiErrors(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(200, "playlist updated successfully", updatePlaylist)
        );
        
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}