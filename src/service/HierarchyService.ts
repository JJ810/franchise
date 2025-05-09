import { v4 as uuidv4 } from "uuid";
import { BaseNode, Node, NodeRequest, StoreNode } from "../types";
import { validateNodeRequest, canAddUnderParent } from "../utils/validators";

class HierarchyService {
    private hierarchies: Map<string, Set<string>> = new Map();
    private nodes: Map<string, Node> = new Map();

    createHierarchy(): { hierarchyId: string; rootId: string } {
        const hierarchyId = uuidv4();
        const rootId = uuidv4();
        const root: BaseNode = {
            id: rootId,
            type: "ROOT",
            name: "Jack in the Box",
            number: "000",
            children: [],
        };
        this.hierarchies.set(hierarchyId, new Set([rootId]));
        this.nodes.set(rootId, root);
        return { hierarchyId, rootId };
    }

    private isNumberUniqueAmongSiblings(parentId: string, number: string): boolean {
        const parent = this.nodes.get(parentId);
        if (!parent) return true;

        for (const childId of parent.children) {
            const child = this.nodes.get(childId);
            if (child && child.number === number) {
                return false;
            }
        }

        return true;
    }

    addNode(hierarchyId: string, parentId: string, node: NodeRequest): string {
        if (!this.hierarchies.has(hierarchyId)) {
            throw new Error("Hierarchy not found.");
        }

        const parent = this.nodes.get(parentId);
        if (!parent) {
            throw new Error("Parent node not found.");
        }

        if (!this.hierarchies.get(hierarchyId)?.has(parentId)) {
            throw new Error("Parent node does not belong to the specified hierarchy.");
        }

        const validationError = validateNodeRequest(node);
        if (validationError) {
            throw new Error(validationError);
        }

        if (node.type === "ROOT") {
            throw new Error("Cannot add another ROOT node to hierarchy.");
        }
        if (!canAddUnderParent(parent.type, node.type)) {
            throw new Error(`${node.type} cannot be added under ${parent.type}`);
        }

        if (!this.isNumberUniqueAmongSiblings(parentId, node.number)) {
            throw new Error(`Number '${node.number}' is already used by another node under the same parent. Numbers must be unique within the same region.`);
        }

        const id = uuidv4();
        const newNode: Node = {
            ...node,
            id,
            parentId,
            children: [],
        };

        parent.children.push(id);
        this.nodes.set(id, newNode);
        this.hierarchies.get(hierarchyId)!.add(id);

        return id;
    }

    listStoresFrom(nodeId: string): StoreNode[] {
        const root = this.nodes.get(nodeId);
        if (!root) throw new Error("Node not found.");

        const result: StoreNode[] = [];

        const dfs = (id: string) => {
            const node = this.nodes.get(id);
            if (!node) return;
            if (node.type === "STORE") {
                result.push(node as StoreNode);
            }
            node.children.forEach(dfs);
        };

        dfs(nodeId);
        return result;
    }
}

export const hierarchyService = new HierarchyService();
