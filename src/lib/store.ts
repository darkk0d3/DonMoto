import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/products";

export type { Product };
export type ProductEntry = Product & { createdAt: string };

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export interface BookingEntry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  bikeMakeModel: string;
  serviceType: string;
  date: string;
  notes?: string;
  status: BookingStatus;
  submittedAt: string;
}

export interface ReviewEntry {
  id: string;
  name: string;
  bike: string;
  rating: number;
  quote: string;
  submittedAt: string;
  approved: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const BOOKINGS_KEY = "donmoto_bookings";
const REVIEWS_KEY = "donmoto_reviews";
const CART_KEY = "donmoto_cart";
const PRODUCTS_KEY = "donmoto_products";

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? "[]"); } catch { return []; }
}
function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Bookings ────────────────────────────────────────────────────────────────
export const getBookings = (): BookingEntry[] => read<BookingEntry>(BOOKINGS_KEY);

export function saveBooking(
  booking: Omit<BookingEntry, "id" | "status" | "submittedAt">
): BookingEntry {
  const entry: BookingEntry = {
    ...booking,
    id: crypto.randomUUID(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  write(BOOKINGS_KEY, [...getBookings(), entry]);
  return entry;
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  write(BOOKINGS_KEY, getBookings().map(b => b.id === id ? { ...b, status } : b));
}

export function deleteBooking(id: string): void {
  write(BOOKINGS_KEY, getBookings().filter(b => b.id !== id));
}

// ── Reviews ─────────────────────────────────────────────────────────────────
export const getReviews = (): ReviewEntry[] => read<ReviewEntry>(REVIEWS_KEY);

export function saveReview(
  review: Omit<ReviewEntry, "id" | "submittedAt" | "approved">
): ReviewEntry {
  const entry: ReviewEntry = {
    ...review,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    approved: false,
  };
  write(REVIEWS_KEY, [...getReviews(), entry]);
  return entry;
}

export function updateReviewApproval(id: string, approved: boolean): void {
  write(REVIEWS_KEY, getReviews().map(r => r.id === id ? { ...r, approved } : r));
}

export function deleteReview(id: string): void {
  write(REVIEWS_KEY, getReviews().filter(r => r.id !== id));
}

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart = (): CartItem[] => read<CartItem>(CART_KEY);

export function addToCart(product: { id: string; name: string; price: number; image: string }): CartItem[] {
  const cart = getCart();
  const existing = cart.find(i => i.productId === product.id);
  const updated = existing
    ? cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    : [...cart, { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
  write(CART_KEY, updated);
  return updated;
}

export function removeFromCart(productId: string): CartItem[] {
  const updated = getCart().filter(i => i.productId !== productId);
  write(CART_KEY, updated);
  return updated;
}

export function clearCart(): void {
  write(CART_KEY, []);
}

// ── Products ─────────────────────────────────────────────────────────────────
export function getProducts(): ProductEntry[] {
  const stored = read<ProductEntry>(PRODUCTS_KEY);
  if (stored.length === 0) {
    const seeded = defaultProducts.map(p => ({ ...p, createdAt: new Date().toISOString() }));
    write(PRODUCTS_KEY, seeded);
    return seeded;
  }
  return stored;
}

export function saveProduct(product: Omit<ProductEntry, "id" | "createdAt">): ProductEntry {
  const entry: ProductEntry = { ...product, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(PRODUCTS_KEY, [...getProducts(), entry]);
  return entry;
}

export function updateProduct(id: string, updates: Partial<Omit<ProductEntry, "id" | "createdAt">>): void {
  write(PRODUCTS_KEY, getProducts().map(p => p.id === id ? { ...p, ...updates } : p));
}

export function deleteProduct(id: string): void {
  write(PRODUCTS_KEY, getProducts().filter(p => p.id !== id));
}
