import express from "express";
import { hierarchyController } from "../controllers/hierarchyController";

const router = express.Router();

router.post("/hierarchies", hierarchyController.createHierarchy);
router.post("/hierarchies/:hierarchyId/nodes", hierarchyController.addNode);
router.get("/nodes/:nodeId/stores", hierarchyController.listStoresFromNode);

export default router;
