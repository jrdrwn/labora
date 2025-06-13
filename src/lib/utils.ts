import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract date in format YYYY-MM-DD from Date or ISO string
 */
export function extractDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // timezone handling to +0700
  d.setHours(d.getHours() + 7);
  // return date in YYYY-MM-DD format
  return d.toISOString().slice(0, 10);
}

/**
 * Extract time in format HH:mm from Date or ISO string
 */
export function extractTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // timezone handling to +0700
  d.setHours(d.getHours() + 7);
  return d.toISOString().slice(11, 16);
}

export function extractDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[d.getDay()];
}
