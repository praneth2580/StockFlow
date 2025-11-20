/**
 * @file This file contains CRUD functions for the Supplier model.
 * These functions interact with a Google Apps Script backend.
 */
import type { ISupplier } from '../types/models';
import { jsonpRequest, SCRIPT_URL } from '../utils';

/**
 * GET Suppliers (with optional filters)
 */
export const getSuppliers = async (
  params: Record<string, string> = {}
): Promise<ISupplier[]> => {
  return jsonpRequest<ISupplier>('Suppliers', {
    action: "get",
    ...params,
  });
};

/**
 * CREATE Supplier  
 * Uses action=create  
 * Sends ?action=create&sheet=Suppliers&data={}
 */
export const createSupplier = async (
  supplier: Omit<ISupplier, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ id: string }> => {

  const result = await jsonpRequest<{ id: string }>('Suppliers', {
    action: "create",
    data: JSON.stringify(supplier),
  });

  // result is an array → return first item
  return result[0];
};

/**
 * UPDATE Supplier  
 * Uses action=update&id=123&data={}
 */
export const updateSupplier = async (
  supplier: Partial<ISupplier> & { id: string }
): Promise<{ status: string }> => {
  const { id, ...rest } = supplier;

  const result = await jsonpRequest<{ status: string }>('Suppliers', {
    action: "update",
    id,
    data: JSON.stringify(rest),
  });

  return result[0]
};

/**
 * DELETE Product  
 * Uses action=delete&id=123
 */
export const deleteSupplier = async (
  id: string
): Promise<{ status: string }> => {

  const result = await jsonpRequest<{ status: string }>('Suppliers', {
    action: "delete",
    id,
  });

  return result[0]
};
