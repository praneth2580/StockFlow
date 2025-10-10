/**
 * @file This file contains CRUD functions for the Sale model.
 * These functions interact with a Google Apps Script backend.
 */
import type { ISale } from '../types/models';

const SCRIPT_ID = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;

export const getSales = async (params: Record<string, string> = {}): Promise<ISale[]> => {
  if (!SCRIPT_ID) {
    console.error('VITE_GOOGLE_SCRIPT_ID is not defined. Please set it in your environment variables.');
    return [];
  }
  
  const query = new URLSearchParams({ sheet: 'Sales', ...params }).toString();
  const response = await fetch(`${SCRIPT_URL}?${query}`);
  if (!response.ok) throw new Error('Failed to fetch sales');
  const { data } = await response.json();
  return data as ISale[];
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
