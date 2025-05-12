import express from 'express';
import request from 'supertest';
import hierarchyRoutes from '../../routes/hierarchyRoutes';

describe('API Integration Tests', () => {
  let app: express.Application;
  let hierarchyId: string;
  let rootId: string;
  let franchiseId: string;
  let regionId: string;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(hierarchyRoutes);
  });

  describe('POST /hierarchies', () => {
    it('should create a new hierarchy', async () => {
      const response = await request(app)
        .post('/hierarchies')
        .expect(201);

      expect(response.body).toHaveProperty('hierarchyId');
      expect(response.body).toHaveProperty('rootId');

      // Save the IDs for later tests
      hierarchyId = response.body.hierarchyId;
      rootId = response.body.rootId;
    });
  });

  describe('POST /hierarchies/:hierarchyId/nodes', () => {
    it('should add a FRANCHISE node under ROOT', async () => {
      const franchiseNode = {
        parentId: rootId,
        type: 'FRANCHISE',
        name: 'Test Franchise',
        number: '001'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)
        .send(franchiseNode)
        .expect(201);

      expect(response.body).toHaveProperty('nodeId');
      franchiseId = response.body.nodeId;
    });

    it('should add a REGION node under FRANCHISE', async () => {
      const regionNode = {
        parentId: franchiseId,
        type: 'REGION',
        name: 'Test Region',
        number: '002'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)
        .send(regionNode)
        .expect(201);

      expect(response.body).toHaveProperty('nodeId');
      regionId = response.body.nodeId;
    });

    it('should add a STORE node under REGION', async () => {
      const storeNode = {
        parentId: regionId,
        type: 'STORE',
        name: 'Test Store',
        number: '003',
        address: '123 Test St'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)
        .send(storeNode)
        .expect(201);

      expect(response.body).toHaveProperty('nodeId');
    });

    it('should return 400 when adding a node with invalid type', async () => {
      const invalidNode = {
        parentId: rootId,
        type: 'INVALID_TYPE',
        name: 'Invalid Node',
        number: '999'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)
        .send(invalidNode)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid node type');
    });

    it('should return 400 when adding a node with invalid parent-child relationship', async () => {
      const invalidNode = {
        parentId: rootId,
        type: 'STORE',
        name: 'Invalid Store',
        number: '999',
        address: '123 Invalid St'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)

        .send(invalidNode)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('cannot be added under');
    });

    it('should return 400 when adding a node with duplicate number among siblings', async () => {
      const duplicateNode = {
        parentId: rootId,
        type: 'FRANCHISE',
        name: 'Duplicate Franchise',
        number: '001'
      };

      const response = await request(app)
        .post(`/hierarchies/${hierarchyId}/nodes`)
        .send(duplicateNode)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already used by another node');
    });
  });

  describe('GET /nodes/:nodeId/stores', () => {
    it('should list all stores from root', async () => {
      const response = await request(app)
        .get(`/nodes/${rootId}/stores`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].type).toBe('STORE');
    });

    it('should list all stores from franchise', async () => {
      const response = await request(app)
        .get(`/nodes/${franchiseId}/stores`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].type).toBe('STORE');
    });

    it('should list all stores from region', async () => {
      const response = await request(app)
        .get(`/nodes/${regionId}/stores`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].type).toBe('STORE');
    });

    it('should return 400 for non-existent node', async () => {
      const response = await request(app)
        .get('/nodes/non-existent-node/stores')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Node not found.');
    });
  });
});
