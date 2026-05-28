import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blobsRouter from "./blobs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blobsRouter);

export default router;