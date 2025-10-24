import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails
} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyjwt } from "../middlewares/auth.middlewares.js";


const userrouter = Router()

userrouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

userrouter.route("/login").post(loginUser)

//secured routes
userrouter.route("/logout").post(verifyjwt,  logoutUser)
userrouter.route("/refresh-token").post(refreshAccessToken)
userrouter.route("/change-password").post(verifyjwt, changeCurrentPassword)
userrouter.route("/current-user").get(verifyjwt, getCurrentUser)
userrouter.route("/update-account").patch(verifyjwt, updateAccountDetails)

userrouter.route("/avatar").patch(verifyjwt, upload.single("avatar"), updateUserAvatar)
userrouter.route("/cover-image").patch(verifyjwt, upload.single("coverImage"), updateUserCoverImage)

userrouter.route("/c/:username").get(verifyjwt, getUserChannelProfile)
userrouter.route("/history").get(verifyjwt, getWatchHistory)

export default userrouter