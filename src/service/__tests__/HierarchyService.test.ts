import { hierarchyService } from '../HierarchyService';
import { NodeRequest } from '../../types';

describe('HierarchyService', () => {
  describe('createHierarchy', () => {
    it('should create a new hierarchy with a root node', () => {
      const result = hierarchyService.createHierarchy();

      expect(result).toHaveProperty('hierarchyId');
      expect(result).toHaveProperty('rootId');
      expect(typeof result.hierarchyId).toBe('string');
      expect(typeof result.rootId).toBe('string');
    });
  });

  describe('addNode', () => {
    let hierarchyId: string;
    let rootId: string;

    beforeEach(() => {
      const result = hierarchyService.createHierarchy();
      hierarchyId = result.hierarchyId;
      rootId = result.rootId;
    });

    it('should add a FRANCHISE node under ROOT', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      const franchiseId = hierarchyService.addNode(hierarchyId, rootId, franchiseNode);
      expect(typeof franchiseId).toBe('string');
    });

    it('should add a REGION node under FRANCHISE', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      const franchiseId = hierarchyService.addNode(hierarchyId, rootId, franchiseNode);

      const regionNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: '002'
      };

      const regionId = hierarchyService.addNode(hierarchyId, franchiseId, regionNode);
      expect(typeof regionId).toBe('string');
    });

    it('should add a STORE node under REGION', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      const franchiseId = hierarchyService.addNode(hierarchyId, rootId, franchiseNode);

      const regionNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: '002'
      };

      const regionId = hierarchyService.addNode(hierarchyId, franchiseId, regionNode);

      const storeNode: NodeRequest = {
        type: 'STORE',
        name: 'Test Store',
        number: '003',
        address: '123 Test St'
      };

      const storeId = hierarchyService.addNode(hierarchyId, regionId, storeNode);
      expect(typeof storeId).toBe('string');
    });

    it('should reject adding a node to a non-existent hierarchy', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      expect(() => {
        hierarchyService.addNode('non-existent-hierarchy', rootId, franchiseNode);
      }).toThrow('Hierarchy not found');
    });

    it('should reject adding a node to a non-existent parent', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      expect(() => {
        hierarchyService.addNode(hierarchyId, 'non-existent-parent', franchiseNode);
      }).toThrow('Parent node not found');
    });

    it('should reject adding a node to a parent from another hierarchy', () => {
      const hierarchy2 = hierarchyService.createHierarchy();

      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      expect(() => {
        hierarchyService.addNode(hierarchyId, hierarchy2.rootId, franchiseNode);
      }).toThrow('Parent node does not belong to the specified hierarchy');
    });

    it('should reject adding another ROOT node', () => {
      const rootNode: NodeRequest = {
        type: 'ROOT',
        name: 'Another Root',
        number: '999'
      };

      expect(() => {
        hierarchyService.addNode(hierarchyId, rootId, rootNode);
      }).toThrow('Cannot add another ROOT node to hierarchy');
    });

    it('should reject adding a node with invalid parent-child relationship', () => {
      const storeNode: NodeRequest = {
        type: 'STORE',
        name: 'Test Store',
        number: '003',
        address: '123 Test St'
      };

      expect(() => {
        hierarchyService.addNode(hierarchyId, rootId, storeNode);
      }).toThrow('STORE cannot be added under ROOT');
    });

    it('should reject adding a node with a duplicate number among siblings', () => {
      const franchiseNode1: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise 1',
        number: '001'
      };

      hierarchyService.addNode(hierarchyId, rootId, franchiseNode1);

      const franchiseNode2: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise 2',
        number: '001'
      };

      expect(() => {
        hierarchyService.addNode(hierarchyId, rootId, franchiseNode2);
      }).toThrow('Number \'001\' is already used by another node under the same parent');
    });

    it('should allow same number for nodes under different parents', () => {
      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      const franchiseId = hierarchyService.addNode(hierarchyId, rootId, franchiseNode);

      const regionNode1: NodeRequest = {
        type: 'REGION',
        name: 'Test Region 1',
        number: '002'
      };

      const regionId1 = hierarchyService.addNode(hierarchyId, franchiseId, regionNode1);

      const regionNode2: NodeRequest = {
        type: 'REGION',
        name: 'Test Region 2',
        number: '003'
      };

      const regionId2 = hierarchyService.addNode(hierarchyId, franchiseId, regionNode2);

      const storeNode1: NodeRequest = {
        type: 'STORE',
        name: 'Test Store 1',
        number: '001',
        address: '123 Test St'
      };

      const storeNode2: NodeRequest = {
        type: 'STORE',
        name: 'Test Store 2',
        number: '001',
        address: '456 Test St'
      };

      const storeId1 = hierarchyService.addNode(hierarchyId, regionId1, storeNode1);
      const storeId2 = hierarchyService.addNode(hierarchyId, regionId2, storeNode2);

      expect(typeof storeId1).toBe('string');
      expect(typeof storeId2).toBe('string');
    });
  });

  describe('listStoresFrom', () => {
    let hierarchyId: string;
    let rootId: string;
    let franchiseId: string;
    let regionId: string;
    let storeId1: string;
    let storeId2: string;

    beforeEach(() => {
      const result = hierarchyService.createHierarchy();
      hierarchyId = result.hierarchyId;
      rootId = result.rootId;

      const franchiseNode: NodeRequest = {
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };
      franchiseId = hierarchyService.addNode(hierarchyId, rootId, franchiseNode);

      const regionNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: '002'
      };
      regionId = hierarchyService.addNode(hierarchyId, franchiseId, regionNode);

      const storeNode1: NodeRequest = {
        type: 'STORE',
        name: 'Test Store 1',
        number: '003',
        address: '123 Test St'
      };
      storeId1 = hierarchyService.addNode(hierarchyId, regionId, storeNode1);

      const storeNode2: NodeRequest = {
        type: 'STORE',
        name: 'Test Store 2',
        number: '004',
        address: '456 Test St'
      };
      storeId2 = hierarchyService.addNode(hierarchyId, regionId, storeNode2);
    });

    it('should list all stores from root', () => {
      const stores = hierarchyService.listStoresFrom(rootId);
      expect(stores).toHaveLength(2);
      expect(stores.map(store => store.id)).toContain(storeId1);
      expect(stores.map(store => store.id)).toContain(storeId2);
    });

    it('should list all stores from franchise', () => {
      const stores = hierarchyService.listStoresFrom(franchiseId);
      expect(stores).toHaveLength(2);
      expect(stores.map(store => store.id)).toContain(storeId1);
      expect(stores.map(store => store.id)).toContain(storeId2);
    });

    it('should list all stores from region', () => {
      const stores = hierarchyService.listStoresFrom(regionId);
      expect(stores).toHaveLength(2);
      expect(stores.map(store => store.id)).toContain(storeId1);
      expect(stores.map(store => store.id)).toContain(storeId2);
    });

    it('should list a single store when starting from that store', () => {
      const stores = hierarchyService.listStoresFrom(storeId1);
      expect(stores).toHaveLength(1);
      expect(stores[0].id).toBe(storeId1);
    });

    it('should throw an error for non-existent node', () => {
      expect(() => {
        hierarchyService.listStoresFrom('non-existent-node');
      }).toThrow('Node not found');
    });
  });
});
