import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  planId: string;
  name: string;
  priceDzd: number;
  priceUsd: number;
  quantity: number;
  countryCode?: string;
  isUnlimited?: boolean;
  dataAmount?: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  applyPromo: (code: string, rate: number) => void;
  removePromo: () => void;
  clearCart: () => void;
  getTotalDzd: () => number;
  getTotalUsd: () => number;
  getDiscountDzd: () => number;
  getFinalTotalDzd: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountRate: 0,
      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      applyPromo: (code, rate) => set({ promoCode: code, discountRate: rate }),
      removePromo: () => set({ promoCode: null, discountRate: 0 }),
      clearCart: () => set({ items: [], promoCode: null, discountRate: 0 }),
      getTotalDzd: () => {
        return get().items.reduce((acc, item) => acc + item.priceDzd * item.quantity, 0);
      },
      getTotalUsd: () => {
        return get().items.reduce((acc, item) => acc + item.priceUsd * item.quantity, 0);
      },
      getDiscountDzd: () => {
        return get().getTotalDzd() * get().discountRate;
      },
      getFinalTotalDzd: () => {
        return get().getTotalDzd() - get().getDiscountDzd();
      },
    }),
    {
      name: 'gosim-cart',
    }
  )
);
