/**
 * @file This file contains CRUD functions for the Product model.
 * These functions interact with a Google Apps Script backend.
 */
import type { IVariant } from '../types/models.ts';
import { jsonpRequest, SCRIPT_URL } from '../utils.ts';

export const getVariants = (params: Record<string, string> = {}): Promise<IVariant[]> => {
  return jsonpRequest<IVariant>("Variants", params);
};

export const createVariant = async (product: Omit<IVariant, 'id' | 'createdAt' | 'updatedAt'>): Promise<IVariant> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: "no-cors", 
    cache: "no-cache",
    redirect: "follow", 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Variants', ...product }),
  });
  if (!response.ok) throw new Error('Failed to create product');
  const { data } = await response.json();
  return data as IVariant;
};

export const updateVariant = async (product: Partial<IVariant> & { id: string }): Promise<IVariant> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Variants', ...product }),
  });
  if (!response.ok) throw new Error('Failed to update product');
  const { data } = await response.json();
  return data as IVariant;
};

export const deleteVariant = async (id: string): Promise<{ success: boolean }> => {
  const query = new URLSearchParams({ sheet: 'Variants', id }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete product');
  return await response.json();
};
