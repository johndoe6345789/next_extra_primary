/**
 * Domain types for the ecommerce shop.
 * @module types/shop
 */

/** A single shop product. */
export interface Product {
  /** Unique product identifier. */
  id: string;
  /** URL-friendly slug. */
  slug: string;
  /** Display name. */
  name: string;
  /** Short description. */
  description: string;
  /** Price in cents. */
  price_cents: number;
  /** Formatted price string, e.g. "$9.99". */
  price_display: string;
  /** Cover image URL. */
  image_url: string;
  /** Available stock quantity. */
  stock: number;
}

/** Paginated products response. */
export interface ProductsResponse {
  /** Product list for the current page. */
  items: Product[];
  /** Total number of products. */
  total: number;
  /** Current page number. */
  page: number;
}

/** A single item inside the cart. */
export interface CartItem {
  /** Cart item identifier. */
  id: string;
  /** Associated product. */
  product: Product;
  /** Quantity in cart. */
  quantity: number;
}

/** Full cart response. */
export interface Cart {
  /** List of cart items. */
  items: CartItem[];
}

/** Order line item. */
export interface OrderItem {
  /** Line item identifier. */
  id: string;
  /** Associated product. */
  product: Product;
  /** Quantity ordered. */
  quantity: number;
  /** Unit price at time of order. */
  unit_price_cents: number;
}

/** An order record. */
export interface Order {
  /** Unique order identifier. */
  id: string;
  /** Order status. */
  status: string;
  /** ISO date string. */
  created_at: string;
  /** Total in cents. */
  total_cents: number;
  /** Formatted total string. */
  total_display: string;
  /** Line items. */
  items?: OrderItem[];
}
