import { atom } from 'nanostores';

export const cart = atom([]);

/**
 * Adds or updates an item in the cart.
 * If the item already exists, it replaces its quantity.
 * @param {{ id: string, handle: string, title: string, price: string, currency: string, image: string }} item
 * @param {number} quantity
 */
export function addToCart(item, quantity = 1) {
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
}

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity is 0 or less, the item is removed.
 * @param {string} itemId The ID of the item to update.
 * @param {number} quantity The new quantity.
 */
export function updateItemQuantity(itemId, quantity) {
  if (quantity <= 0) {
    cart.set(cart.get().filter(item => item.id !== itemId));
  } else {
    const updatedCart = cart.get().map(item =>
      item.id === itemId ? { ...item, quantity: quantity } : item
    );
    cart.set(updatedCart);
  }
}

export function clearCart() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart');
    cart.set([]);
  }
}

cart.listen(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(value));
  }
});

if (typeof window !== 'undefined') {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart.set(JSON.parse(storedCart));
  }
}