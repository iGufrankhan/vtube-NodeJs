import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controllers.js"
import {verifyjwt} from "../middlewares/auth.middlewares.js"

const Commentrouter = Router();

// Commentrouter.use(verifyjwt); 
Commentrouter.route("/:videoId").get(getVideoComments).post(addComment);
Commentrouter.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default  Commentrouter