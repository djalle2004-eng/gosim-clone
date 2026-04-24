import { create } from 'zustand';

export interface CartItem {
  id: string;
  planId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.id === newItem.id);
    let updatedItems;
    if (existing) {
      updatedItems = state.items.map(i => 
        i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...state.items, { ...newItem, quantity: 1 }];
    }
    const total = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return { items: updatedItems, total };
  }),
  removeItem: (id) => set((state) => {
    const updatedItems = state.items.filter(i => i.id !== id);
    const total = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return { items: updatedItems, total };
  }),
  clearCart: () => set({ items: [], total: 0 }),
}));
