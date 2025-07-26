import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';


export enum ToastType {
  ERROR = 'danger',
  INFO = 'info',
  SUCCESS = 'success',
}

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // Duration in milliseconds
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message, type, duration = 30_000) => {
    const id = uuidv4();
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));

    // Automatically remove the toast after the specified duration
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));
