import { Router } from "express";
import {  createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";


const tweetrouter = Router();
tweetrouter.use(verifyjwt);

tweetrouter.post("/", createTweet);
tweetrouter.get("/user/:userId", getUserTweets);
tweetrouter.put("/:tweetId", updateTweet);
tweetrouter.delete("/:tweetId", deleteTweet);


export default tweetrouter;