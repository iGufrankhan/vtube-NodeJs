import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controllers.js"
import {verifyjwt} from "../middlewares/auth.middlewares.js"

const LikeRouter = Router();
LikeRouter.use(verifyjwt); // Apply verifyJWT middleware to all routes in this file

LikeRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
LikeRouter.route("/toggle/c/:commentId").post(toggleCommentLike);
LikeRouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
LikeRouter.route("/videos").get(getLikedVideos);

export default LikeRouter;