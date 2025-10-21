import { Router } from "express";

import { healthcheck} from "../controllers/healthcheck.controllers.js";

const healthcheckrouter=Router()

healthcheckrouter.route('/').get(healthcheck)



export default healthcheckrouter