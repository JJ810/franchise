import { v4 as uuidv4 } from "uuid";
import { BaseNode, Node, NodeType, NodeRequest, StoreNode } from "../types";

const VALID_CHILDREN: Record<NodeType, NodeType[]> = {
    ROOT: ['FRANCHISE'],
    FRANCHISE: ['REGION'],
    REGION: ['STORE'],
    STORE: []
};

class HierarchyService {
    private hierarchies: Map<string, Set<string>> = new Map();
    private nodes: Map<string, Node> = new Map();

    createHierarchy(): string {
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
        return hierarchyId;
    }

    addNode(hierarchyId: string, parentId: string, node: NodeRequest): string {
        const parent = this.nodes.get(parentId);

        if (!parent) throw new Error("Parent node not found.");
        if (!this.hierarchies.has(hierarchyId)) {
            throw new Error("Hierarchy not found.");
        }

        if (!VALID_CHILDREN[parent.type].includes(node.type)) {
            throw new Error(`${node.type} cannot be added under ${parent.type}`);
        }

        if (node.type === "STORE" && !node.address) {
            throw new Error("Store must have an address.");
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
