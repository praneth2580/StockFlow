/**
 * @file CRUD functions for the Variant model.
 * Works with Google Apps Script JSONP backend.
 */
import type { IVariant } from '../types/models.ts';
import { jsonpRequest } from '../utils.ts';

/**
 * GET Variants
 */
export const getVariants = async (
  params: Record<string, string> = {}
): Promise<IVariant[]> => {
  return jsonpRequest<IVariant>('Variants', {
    action: "get",
    ...params,
  });
};

/**
 * CREATE Variant
 * Google Apps Script returns: [{ id: "...", ... }]
 */
export const createVariant = async (
  variant: Omit<IVariant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IVariant> => {
  const result = await jsonpRequest<IVariant>('Variants', {
    action: "create",
    data: JSON.stringify(variant),
  });

  return result[0]; // unwrap array
};

/**
 * UPDATE Variant
 */
export const updateVariant = async (
  variant: Partial<IVariant> & { id: string }
): Promise<IVariant> => {
  const result = await jsonpRequest<IVariant>('Variants', {
    action: "update",
    data: JSON.stringify(variant),
  });

  return result[0];
};

/**
 * DELETE Variant
 */
export const deleteVariant = async (id: string): Promise<{ success: boolean }> => {
  const result = await jsonpRequest<{ success: boolean }>('Variants', {
    action: "delete",
    id,
  });

  return result[0];
};
