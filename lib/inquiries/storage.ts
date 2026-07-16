"use client";

const STORAGE_KEY = "inotech:inquiries";
const MAX_ENTRIES = 50;

export interface InquiryEntry {
  productName: string;
  sku: string;
  date: string;
}

export function logInquiry(entry: Omit<InquiryEntry, "date">) {
  if (typeof window === "undefined") return;
  try {
    const existing: InquiryEntry[] = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    const next = [{ ...entry, date: new Date().toISOString() }, ...existing].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota) — inquiry still goes through on WhatsApp.
  }
}

export function getInquiries(): InquiryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
