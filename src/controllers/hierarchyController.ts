import { Request, Response } from "express";
import { hierarchyService } from "../service/HierarchyService";
import { NodeRequest } from "../types";

export const hierarchyController = {
    createHierarchy: (_: Request, res: Response): void => {
        const { hierarchyId, rootId } = hierarchyService.createHierarchy();
        res.status(201).json({ hierarchyId, rootId });
    },

    addNode: (req: Request, res: Response): void => {
        const { hierarchyId } = req.params;
        const { parentId, type, name, number, address } = req.body;

        try {
            const nodeRequest: NodeRequest = {
                type,
                name,
                number,
                address,
            };

            const nodeId = hierarchyService.addNode(hierarchyId, parentId, nodeRequest);
            res.status(201).json({ nodeId });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    listStoresFromNode: (req: Request, res: Response): void => {
        const { nodeId } = req.params;
        try {
            const stores = hierarchyService.listStoresFrom(nodeId);
            res.status(200).json(stores);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
};
