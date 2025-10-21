import mongoose, { Mongoose } from "mongoose";
import { ApiErrors} from "../utils/Apierror.js";

const errorHandler=(err,req,res,)=>
{
     let error=err
     if(!(error instanceof ApiErrors))
     {
        const statusCode=error.statusCode ||error instanceof mongoose.Error?400:500
     }

     const message=error.message ||"something went wrong"
     error=new ApiErrors(statusCode,message,error?.errors||[],err.stack)
    
}

export {errorHandler}