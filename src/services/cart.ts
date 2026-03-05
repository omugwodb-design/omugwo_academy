import { useCartStore } from '../stores/cartStore';

export const cartService = {
  addCourse(courseId: string) {
    useCartStore.getState().addCourse(courseId);
  },

  removeCourse(courseId: string) {
    useCartStore.getState().removeCourse(courseId);
  },

  clear() {
    useCartStore.getState().clear();
  },

  getCourseIds(): string[] {
    return useCartStore.getState().items.map((i) => i.courseId).filter(Boolean);
  },
};
