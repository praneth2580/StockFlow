/**
 * @file This file contains CRUD functions for the Product model.
 * These functions interact with a Google Apps Script backend.
 */
import type { IProduct } from '../types/models';
import { jsonpRequest, SCRIPT_URL } from '../utls';

export const getProducts = (params: Record<string, string> = {}): Promise<IProduct[]> => {
  return jsonpRequest<IProduct>("Products", params);
};

export const createProduct = async (product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    mode: "no-cors", 
    cache: "no-cache",
    redirect: "follow", 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Products', ...product }),
  });
  if (!response.ok) throw new Error('Failed to create product');
  const { data } = await response.json();
  return data as IProduct;
};

export const updateProduct = async (product: Partial<IProduct> & { id: string }): Promise<IProduct> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Products', ...product }),
  });
  if (!response.ok) throw new Error('Failed to update product');
  const { data } = await response.json();
  return data as IProduct;
};

export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
  const query = new URLSearchParams({ sheet: 'Products', id }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete product');
  return await response.json();
};
