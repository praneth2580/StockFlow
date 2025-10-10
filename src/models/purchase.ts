/**
 * @file This file contains CRUD functions for the Purchase model.
 * These functions interact with a Google Apps Script backend.
 */
import type { IPurchase } from '../types/models';

const SCRIPT_ID = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const getPurchases = async (params: Record<string, string> = {}): Promise<IPurchase[]> => {
  if (!SCRIPT_ID) {
    console.error('VITE_GOOGLE_SCRIPT_ID is not defined. Please set it in your environment variables.');
    return [];
  }
  
  const query = new URLSearchParams({ sheet: 'Purchases', ...params }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`);
  if (!response.ok) throw new Error('Failed to fetch purchases');
  const { data } = await response.json();
  return data as IPurchase[];
};

export const createPurchase = async (purchase: Omit<IPurchase, 'id' | 'date'>): Promise<IPurchase> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Purchases', ...purchase }),
  });
  if (!response.ok) throw new Error('Failed to create purchase');
  const { data } = await response.json();
  return data as IPurchase;
};

export const updatePurchase = async (purchase: Partial<IPurchase> & { id: string }): Promise<IPurchase> => {
  const response = await fetch(SCRIPT_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'Purchases', ...purchase }),
  });
  if (!response.ok) throw new Error('Failed to update purchase');
  const { data } = await response.json();
  return data as IPurchase;
};

export const deletePurchase = async (id: string): Promise<{ success: boolean }> => {
  const query = new URLSearchParams({ sheet: 'Purchases', id }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete purchase');
  return await response.json();
};
