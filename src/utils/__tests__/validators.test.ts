import { validateNodeRequest, canAddUnderParent, NODE_TYPES } from '../validators';
import { NodeRequest } from '../../types';

describe('Validators', () => {
  describe('validateNodeRequest', () => {
    it('should validate a valid STORE node request', () => {
      const validStoreNode: NodeRequest = {
        type: 'STORE',
        name: 'Test Store',
        number: '123',
        address: '123 Test St'
      };
      
      const result = validateNodeRequest(validStoreNode);
      expect(result).toBeNull();
    });

    it('should validate a valid non-STORE node request', () => {
      const validRegionNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: '456'
      };
      
      const result = validateNodeRequest(validRegionNode);
      expect(result).toBeNull();
    });

    it('should reject invalid node type', () => {
      const invalidTypeNode: NodeRequest = {
        type: 'INVALID_TYPE' as any,
        name: 'Test Node',
        number: '123'
      };
      
      const result = validateNodeRequest(invalidTypeNode);
      expect(result).toContain('Invalid node type');
    });

    it('should reject empty name', () => {
      const emptyNameNode: NodeRequest = {
        type: 'REGION',
        name: '',
        number: '123'
      };
      
      const result = validateNodeRequest(emptyNameNode);
      expect(result).toBe('Name is required');
    });

    it('should reject name longer than 100 characters', () => {
      const longNameNode: NodeRequest = {
        type: 'REGION',
        name: 'a'.repeat(101),
        number: '123'
      };
      
      const result = validateNodeRequest(longNameNode);
      expect(result).toBe('Name must be 100 characters or less');
    });

    it('should reject empty number', () => {
      const emptyNumberNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: ''
      };
      
      const result = validateNodeRequest(emptyNumberNode);
      expect(result).toBe('Number is required');
    });

    it('should reject number not in 3-digit format', () => {
      const invalidNumberNode: NodeRequest = {
        type: 'REGION',
        name: 'Test Region',
        number: '12'
      };
      
      const result = validateNodeRequest(invalidNumberNode);
      expect(result).toContain('Number must be exactly 3 digits');
    });

    it('should reject STORE node without address', () => {
      const storeWithoutAddress: NodeRequest = {
        type: 'STORE',
        name: 'Test Store',
        number: '123'
      };
      
      const result = validateNodeRequest(storeWithoutAddress);
      expect(result).toBe('Address is required for Store nodes');
    });

    it('should reject STORE node with address longer than 200 characters', () => {
      const storeWithLongAddress: NodeRequest = {
        type: 'STORE',
        name: 'Test Store',
        number: '123',
        address: 'a'.repeat(201)
      };
      
      const result = validateNodeRequest(storeWithLongAddress);
      expect(result).toBe('Address must be 200 characters or less');
    });
  });

  describe('canAddUnderParent', () => {
    it('should allow FRANCHISE under ROOT', () => {
      expect(canAddUnderParent('ROOT', 'FRANCHISE')).toBe(true);
    });

    it('should allow REGION under FRANCHISE', () => {
      expect(canAddUnderParent('FRANCHISE', 'REGION')).toBe(true);
    });

    it('should allow STORE under REGION', () => {
      expect(canAddUnderParent('REGION', 'STORE')).toBe(true);
    });

    it('should not allow STORE under ROOT', () => {
      expect(canAddUnderParent('ROOT', 'STORE')).toBe(false);
    });

    it('should not allow REGION under ROOT', () => {
      expect(canAddUnderParent('ROOT', 'REGION')).toBe(false);
    });

    it('should not allow FRANCHISE under REGION', () => {
      expect(canAddUnderParent('REGION', 'FRANCHISE')).toBe(false);
    });

    it('should not allow any node under STORE', () => {
      NODE_TYPES.forEach(type => {
        expect(canAddUnderParent('STORE', type)).toBe(false);
      });
    });
  });
});
