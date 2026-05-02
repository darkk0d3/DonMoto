import { supabase } from "./supabase";
import { products as defaultProducts, bikeModels as defaultBikeModels } from "@/data/products";
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

// ── Row mappers (DB snake_case → TS camelCase) ────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBooking(row: any): BookingEntry {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    bikeMakeModel: row.bike_make_model,
    serviceType: row.service_type,
    date: row.date,
    notes: row.notes ?? undefined,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReview(row: any): ReviewEntry {
  return {
    id: row.id,
    name: row.name,
    bike: row.bike,
    rating: row.rating,
    quote: row.quote,
    submittedAt: row.submitted_at,
    approved: row.approved,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProduct(row: any): ProductEntry {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    image: row.image,
    badge: row.badge ?? undefined,
    compatibleModels: row.compatible_models,
    createdAt: row.created_at,
  };
}

// ── Cart (localStorage — per-session, no cloud sync needed) ──────────────────
const CART_KEY = "donmoto_cart";

function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); } catch { return []; }
}
function writeCart(data: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(data));
}

export const getCart = (): CartItem[] => readCart();

export function addToCart(product: { id: string; name: string; price: number; image: string }): CartItem[] {
  const cart = readCart();
  const existing = cart.find(i => i.productId === product.id);
  const updated = existing
    ? cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    : [...cart, { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
  writeCart(updated);
  return updated;
}

export function removeFromCart(productId: string): CartItem[] {
  const updated = readCart().filter(i => i.productId !== productId);
  writeCart(updated);
  return updated;
}

export function clearCart(): void {
  writeCart([]);
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function getBookings(): Promise<BookingEntry[]> {
  const { data, error } = await supabase.from("bookings").select("*").order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toBooking);
}

export async function saveBooking(
  booking: Omit<BookingEntry, "id" | "status" | "submittedAt">
): Promise<BookingEntry> {
  const { data, error } = await supabase.from("bookings").insert({
    full_name: booking.fullName,
    phone: booking.phone,
    email: booking.email,
    bike_make_model: booking.bikeMakeModel,
    service_type: booking.serviceType,
    date: booking.date,
    notes: booking.notes ?? null,
    status: "pending",
  }).select().single();
  if (error) throw error;
  return toBooking(data);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

// ── Reviews ───────────────────────────────────────────────────────────────────
export async function getReviews(): Promise<ReviewEntry[]> {
  const { data, error } = await supabase.from("reviews").select("*").order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toReview);
}

export async function saveReview(
  review: Omit<ReviewEntry, "id" | "submittedAt" | "approved">
): Promise<ReviewEntry> {
  const { data, error } = await supabase.from("reviews").insert({
    name: review.name,
    bike: review.bike,
    rating: review.rating,
    quote: review.quote,
    approved: false,
  }).select().single();
  if (error) throw error;
  return toReview(data);
}

export async function updateReviewApproval(id: string, approved: boolean): Promise<void> {
  const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

// ── Products ──────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<ProductEntry[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  if (!data || data.length === 0) {
    const seeded = defaultProducts.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      badge: p.badge ?? null,
      compatible_models: p.compatibleModels,
    }));
    const { data: inserted, error: insertError } = await supabase.from("products").insert(seeded).select();
    if (insertError) throw insertError;
    return (inserted ?? []).map(toProduct);
  }
  return data.map(toProduct);
}

export async function saveProduct(product: Omit<ProductEntry, "id" | "createdAt">): Promise<ProductEntry> {
  const { data, error } = await supabase.from("products").insert({
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    badge: product.badge ?? null,
    compatible_models: product.compatibleModels,
  }).select().single();
  if (error) throw error;
  return toProduct(data);
}

export async function updateProduct(id: string, updates: Partial<Omit<ProductEntry, "id" | "createdAt">>): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.image !== undefined) dbUpdates.image = updates.image;
  if ("badge" in updates) dbUpdates.badge = updates.badge ?? null;
  if (updates.compatibleModels !== undefined) dbUpdates.compatible_models = updates.compatibleModels;
  const { error } = await supabase.from("products").update(dbUpdates).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ── Bike Models ───────────────────────────────────────────────────────────────
export async function getBikeModels(): Promise<string[]> {
  const { data, error } = await supabase.from("config").select("value").eq("key", "bikeModels").single();
  if (error || !data) {
    await supabase.from("config").insert({ key: "bikeModels", value: defaultBikeModels });
    return [...defaultBikeModels];
  }
  return data.value as string[];
}

export async function addBikeModel(name: string): Promise<string[]> {
  const models = await getBikeModels();
  if (models.map(m => m.toLowerCase()).includes(name.toLowerCase())) return models;
  const updated = [...models, name];
  await supabase.from("config").upsert({ key: "bikeModels", value: updated });
  return updated;
}

export async function removeBikeModel(name: string): Promise<string[]> {
  const models = await getBikeModels();
  const updated = models.filter(m => m !== name);
  await supabase.from("config").upsert({ key: "bikeModels", value: updated });
  return updated;
}
