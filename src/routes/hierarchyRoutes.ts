import express from "express";
import { hierarchyService } from "../service/HierarchyService";

const router = express.Router();

router.post("/hierarchies", (_, res) => {
    const id = hierarchyService.createHierarchy();
    res.status(201).json({ hierarchyId: id });
});

router.post("/hierarchies/:hierarchyId/nodes", (req, res) => {
    const { hierarchyId } = req.params;
    const { parentId, type, name, number, address } = req.body;

    try {
        const nodeId = hierarchyService.addNode(hierarchyId, parentId, {
            type,
            name,
            number,
            address,
        });
        res.status(201).json({ nodeId });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/nodes/:nodeId/stores", (req, res) => {
    const { nodeId } = req.params;
    try {
        const stores = hierarchyService.listStoresFrom(nodeId);
        res.status(200).json(stores);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
