/**
 * @file This file contains CRUD functions for the Supplier model.
 * These functions interact with a Google Apps Script backend.
 */
import type { ISupplier } from '../types/models';
import { jsonpRequest, SCRIPT_URL } from '../utls';

export const getSuppliers = async (params: Record<string, string> = {}): Promise<ISupplier[]> => {
  return jsonpRequest<ISupplier>("Suppliers", params);
};

export const createSupplier = async (supplier: Omit<ISupplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISupplier> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Suppliers', ...supplier }),
  });
  if (!response.ok) throw new Error('Failed to create supplier');
  const { data } = await response.json();
  return data as ISupplier;
};

export const updateSupplier = async (supplier: Partial<ISupplier> & { id: string }): Promise<ISupplier> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Suppliers', ...supplier }),
  });
  if (!response.ok) throw new Error('Failed to update supplier');
  const { data } = await response.json();
  return data as ISupplier;
};

export const deleteSupplier = async (id: string): Promise<{ success: boolean }> => {
  const query = new URLSearchParams({ sheet: 'Suppliers', id }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete supplier');
  return await response.json();
};
