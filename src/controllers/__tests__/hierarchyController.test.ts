import { Request, Response } from 'express';
import { hierarchyController } from '../hierarchyController';
import { hierarchyService } from '../../service/HierarchyService';

jest.mock('../../service/HierarchyService', () => ({
  hierarchyService: {
    createHierarchy: jest.fn(),
    addNode: jest.fn(),
    listStoresFrom: jest.fn()
  }
}));

describe('hierarchyController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {};
    mockResponse = {
      status: responseStatus,
      json: responseJson
    };

    jest.clearAllMocks();
  });

  describe('createHierarchy', () => {
    it('should create a hierarchy and return 201 status with hierarchyId and rootId', () => {
      const mockHierarchy = { hierarchyId: 'test-hierarchy-id', rootId: 'test-root-id' };
      (hierarchyService.createHierarchy as jest.Mock).mockReturnValue(mockHierarchy);

      hierarchyController.createHierarchy(mockRequest as Request, mockResponse as Response);

      expect(hierarchyService.createHierarchy).toHaveBeenCalledTimes(1);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockHierarchy);
    });
  });

  describe('addNode', () => {
    it('should add a node and return 201 status with nodeId', () => {
      const mockNodeId = 'test-node-id';
      const mockHierarchyId = 'test-hierarchy-id';
      const mockParentId = 'test-parent-id';
      const mockNodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      mockRequest.params = { hierarchyId: mockHierarchyId };
      mockRequest.body = {
        parentId: mockParentId,
        ...mockNodeRequest
      };

      (hierarchyService.addNode as jest.Mock).mockReturnValue(mockNodeId);

      hierarchyController.addNode(mockRequest as Request, mockResponse as Response);

      expect(hierarchyService.addNode).toHaveBeenCalledWith(
        mockHierarchyId,
        mockParentId,
        mockNodeRequest
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({ nodeId: mockNodeId });
    });

    it('should handle errors and return 400 status with error message', () => {
      const errorMessage = 'Test error message';
      mockRequest.params = { hierarchyId: 'test-hierarchy-id' };
      mockRequest.body = {
        parentId: 'test-parent-id',
        type: 'INVALID_TYPE',
        name: 'Test Node',
        number: '001'
      };

      (hierarchyService.addNode as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      hierarchyController.addNode(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('listStoresFromNode', () => {
    it('should list stores and return 200 status with stores array', () => {
      const mockNodeId = 'test-node-id';
      const mockStores = [
        {
          id: 'store-1',
          type: 'STORE',
          name: 'Store 1',
          number: '001',
          address: '123 Test St',
          children: [],
          parentId: 'region-1'
        },
        {
          id: 'store-2',
          type: 'STORE',
          name: 'Store 2',
          number: '002',
          address: '456 Test St',
          children: [],
          parentId: 'region-1'
        }
      ];

      mockRequest.params = { nodeId: mockNodeId };
      (hierarchyService.listStoresFrom as jest.Mock).mockReturnValue(mockStores);

      hierarchyController.listStoresFromNode(mockRequest as Request, mockResponse as Response);

      expect(hierarchyService.listStoresFrom).toHaveBeenCalledWith(mockNodeId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockStores);
    });

    it('should handle errors and return 400 status with error message', () => {
      const errorMessage = 'Node not found';
      mockRequest.params = { nodeId: 'non-existent-node' };

      (hierarchyService.listStoresFrom as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      hierarchyController.listStoresFromNode(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
