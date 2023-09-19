import { Router } from "express";
import {updateApiRepo} from "../controller/controller";

const route = Router();

route.post('/update/api', updateApiRepo);

export default route;
