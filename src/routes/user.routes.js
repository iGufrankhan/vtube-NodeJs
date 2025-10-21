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


const router = Router()

router.route("/register").post(
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

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyjwt,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyjwt, changeCurrentPassword)
router.route("/current-user").get(verifyjwt, getCurrentUser)
router.route("/update-account").patch(verifyjwt, updateAccountDetails)

router.route("/avatar").patch(verifyjwt, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyjwt, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyjwt, getUserChannelProfile)
router.route("/history").get(verifyjwt, getWatchHistory)

export default router