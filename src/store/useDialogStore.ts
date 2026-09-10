import { create } from 'zustand';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

export interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  isAlertOnly?: boolean; // If true, only shows OK/Confirm button without Cancel
}

interface DialogState {
  isOpen: boolean;
  options: DialogOptions;
  resolver: ((value: boolean) => void) | null;
  openDialog: (options: DialogOptions) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
  close: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  options: {
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isAlertOnly: false,
  },
  resolver: null,
  openDialog: (options: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options: {
          type: options.type || 'warning',
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          ...options,
        },
        resolver: resolve,
      });
    });
  },
  confirm: () => {
    const { resolver } = get();
    if (resolver) resolver(true);
    set({ isOpen: false, resolver: null });
  },
  cancel: () => {
    const { resolver } = get();
    if (resolver) resolver(false);
    set({ isOpen: false, resolver: null });
  },
  close: () => {
    const { resolver } = get();
    if (resolver) resolver(false);
    set({ isOpen: false, resolver: null });
  },
}));

// Convenient standalone helper functions for both async/await or hook usage
export const showConfirmDialog = (options: DialogOptions): Promise<boolean> => {
  return useDialogStore.getState().openDialog({
    ...options,
    isAlertOnly: false,
  });
};

export const showAlertDialog = (options: Omit<DialogOptions, 'isAlertOnly' | 'cancelText'>): Promise<boolean> => {
  return useDialogStore.getState().openDialog({
    ...options,
    isAlertOnly: true,
  });
};
