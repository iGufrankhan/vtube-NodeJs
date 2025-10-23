import { Router } from "express";
import {  createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";


const router = Router();
router.use(verifyjwt);

router.post("/", createTweet);
router.get("/user/:userId", getUserTweets);
router.put("/:tweetId", updateTweet);
router.delete("/:tweetId", deleteTweet);