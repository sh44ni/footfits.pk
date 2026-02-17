import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return 'Rs. 0';
  const num = typeof price === 'string' ? parseFloat(price) : Number(price);
  if (isNaN(num)) return 'Rs. 0';
  return `Rs. ${num.toLocaleString('en-PK')}`;
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateOrderNumber(id: number): string {
  return `FF-${(10000 + id).toString()}`;
}
