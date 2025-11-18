/**
 * @file This file contains CRUD functions for the Sale model.
 * These functions interact with a Google Apps Script backend.
 */
import type { ISale } from '../types/models';
import { jsonpRequest, SCRIPT_URL } from '../utils';

export const getSales = async (params: Record<string, string> = {}): Promise<ISale[]> => {
  return jsonpRequest<ISale>("Sales", params);
};

export const createSale = async (sale: Omit<ISale, 'id' | 'date'>): Promise<ISale> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Sales', ...sale }),
  });
  if (!response.ok) throw new Error('Failed to create sale');
  const { data } = await response.json();
  return data as ISale;
};

export const updateSale = async (sale: Partial<ISale> & { id: string }): Promise<ISale> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Sales', ...sale }),
  });
  if (!response.ok) throw new Error('Failed to update sale');
  const { data } = await response.json();
  return data as ISale;
};

export const deleteSale = async (id: string): Promise<{ success: boolean }> => {
  const query = new URLSearchParams({ sheet: 'Sales', id }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete sale');
  return await response.json();
};
