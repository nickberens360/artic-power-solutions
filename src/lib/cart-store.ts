import { atom } from 'nanostores';

/**
 * Interface for cart items
 */
export interface CartItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
}

export const cart = atom<CartItem[]>([]);

/**
 * Adds or updates an item in the cart.
 * If the item already exists, it replaces its quantity.
 * @param {CartItem} item - The item to add to the cart
 * @param {number} quantity - The quantity of the item
 */
export function addToCart(item: CartItem, quantity = 1): void {
  try {
    const currentCart = cart.get();
    const existingEntry = currentCart.find(entry => entry.id === item.id);

    if (existingEntry) {
      const updatedCart = currentCart.map(entry =>
        entry.id === item.id
          ? { ...entry, quantity: quantity }
          : entry
      );
      cart.set(updatedCart);
    } else {
      cart.set([...currentCart, { ...item, quantity }]);
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    // Could add user notification here
  }
}

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity is 0 or less, the item is removed.
 * @param {string} itemId - The ID of the item to update
 * @param {number} quantity - The new quantity
 */
export function updateItemQuantity(itemId: string, quantity: number): void {
  try {
    if (quantity <= 0) {
      cart.set(cart.get().filter(item => item.id !== itemId));
    } else {
      const updatedCart = cart.get().map(item =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      );
      cart.set(updatedCart);
    }
  } catch (error) {
    console.error('Error updating item quantity:', error);
    // Could add user notification here
  }
}

/**
 * Clears all items from the cart
 */
export function clearCart(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
      cart.set([]);
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    // Could add user notification here
  }
}

// Save cart to localStorage when it changes
cart.listen(value => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
});

// Initialize cart from localStorage
if (typeof window !== 'undefined') {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart.set(JSON.parse(storedCart));
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    // If there's an error loading the cart, start with an empty cart
    cart.set([]);
  }
}