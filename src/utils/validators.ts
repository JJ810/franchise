import { NodeRequest, NodeType } from "../types";

export const NODE_TYPES: NodeType[] = ["ROOT", "FRANCHISE", "REGION", "STORE"];

export const validateNodeRequest = (node: NodeRequest): string | null => {
  if (!node.type || !NODE_TYPES.includes(node.type)) {
    return `Invalid node type. Must be one of: ${NODE_TYPES.join(", ")}`;
  }

  if (!node.name || node.name.trim().length === 0) {
    return "Name is required";
  }

  if (node.name.length > 100) {
    return "Name must be 100 characters or less";
  }

  if (!node.number || node.number.trim().length === 0) {
    return "Number is required";
  }

  const numberPattern = /^\d{3}$/;
  if (!numberPattern.test(node.number)) {
    return "Number must be exactly 3 digits (e.g., '002', '155', '233')";
  }

  if (node.type === "STORE") {
    if (!node.address || node.address.trim().length === 0) {
      return "Address is required for Store nodes";
    }

    if (node.address && node.address.length > 200) {
      return "Address must be 200 characters or less";
    }
  }

  return null;
};

export const canAddUnderParent = (parentType: NodeType, childType: NodeType): boolean => {
  const VALID_CHILDREN: Record<NodeType, NodeType[]> = {
    ROOT: ['FRANCHISE'],
    FRANCHISE: ['REGION'],
    REGION: ['STORE'],
    STORE: []
  };

  return VALID_CHILDREN[parentType].includes(childType);
};
