import express from 'express'
import cors from "cors"

import cookieParser from "cookie-parser"







const app=express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true,

    })
)








// common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))




// import routes

import healthcheckRouter from './routes/health.routes.js'
import userRouter from './routes/user.routes.js'

import Commentrouter from './routes/comment.routes.js'
import { Video } from './models/video.models.js'




//import routes
import Videororoute from './routes/video.routes.js'
import dashboardrouter from './routes/dashboard.routes.js'
import LikeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import  subscriptionRouter  from './routes/subscriptions.routes.js'
import tweetRouter from './routes/tweet.routes.js'

// routes declaration

app.use('/api/v1/healthcheck',healthcheckRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/comments',Commentrouter)
app.use('/api/v1/videos',Videororoute)
app.use('/api/v1/dashboard',dashboardrouter)
app.use('/api/v1/likes',LikeRouter)
app.use('/api/v1/playlists',playlistRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)
app.use('/api/v1/tweets',tweetRouter)











// app.use(errorHandler)

export {app}
