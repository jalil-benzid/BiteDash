import { Router } from "express";
import { getTest } from "../controllers/test";

const router: Router = Router();

router.get("/test", getTest);


export default router;
