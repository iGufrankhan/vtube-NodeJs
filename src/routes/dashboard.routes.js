import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controllers.js"
import {verifyjwt} from "../middlewares/auth.middlewares.js"

const dashboardrouter = Router();

dashboardrouter.use(verifyjwt); // Apply verifyJWT middleware to all routes in this file

dashboardrouter.route("/stats").get(getChannelStats);
dashboardrouter.route("/videos").get(getChannelVideos);

export default dashboardrouter;