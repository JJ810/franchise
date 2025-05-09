export type NodeType = "ROOT" | "FRANCHISE" | "REGION" | "STORE";

export interface BaseNode {
    id: string;
    type: NodeType;
    name: string;
    children: string[];
    number: string;
    parentId?: string;
}

export interface StoreNode extends BaseNode {
    type: "STORE";
    address: string;
}

export type NodeRequest = Omit<BaseNode, "id" | "parentId" | "children"> & {
    address?: string;
};

export type Node = BaseNode | StoreNode;
