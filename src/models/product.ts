/**
 * @file This file contains CRUD functions for the Product model.
 * These functions interact with a Google Apps Script backend.
 */
import type { IProduct } from '../types/models';

const SCRIPT_ID = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const getProducts = async (params: Record<string, string> = {}): Promise<IProduct[]> => {
  if (!SCRIPT_ID) {
    console.error('VITE_GOOGLE_SCRIPT_ID is not defined. Please set it in your environment variables.');
    return [];
  }

  const query = new URLSearchParams({ sheet: 'Products', ...params }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const { data } = await response.json();
  return data as IProduct[];
};

export const createProduct = async (product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
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
