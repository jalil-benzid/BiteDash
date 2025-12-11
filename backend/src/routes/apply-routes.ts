import { Router } from "express";
import {
    createApply
} from "../controllers/apply-controllers"
import upload from "../middleware/upload-apply-middleware"


const router: Router = Router();

router.post("/createApply", upload, createApply);


export default router;
