import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  courseId: string;
}

interface CartState {
  items: CartItem[];

  addCourse: (courseId: string) => void;
  removeCourse: (courseId: string) => void;
  clear: () => void;
  hasCourse: (courseId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addCourse: (courseId) => {
        const items = get().items;
        if (items.some((i) => i.courseId === courseId)) return;
        set({ items: [...items, { courseId }] });
      },

      removeCourse: (courseId) => {
        set({ items: get().items.filter((i) => i.courseId !== courseId) });
      },

      clear: () => set({ items: [] }),

      hasCourse: (courseId) => get().items.some((i) => i.courseId === courseId),
    }),
    {
      name: 'omugwo_cart_v1',
    }
  )
);
