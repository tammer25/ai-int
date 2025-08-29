"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// Toast notification types
interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  action?: ToastActionElement;
  duration?: number;
}

// Context state interface
interface ToastState {
  toasts: Toast[];
}

// Action types for the reducer
type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'REMOVE_TOAST'; id: string };

// Context interface
interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast reducer
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.id ? { ...toast, open: false } : toast
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    default:
      return state;
  }
};

// Generate unique ID for toasts
let count = 0;
const generateId = (): string => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

// Provider component
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  // Add a new toast
  const toast = (toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    dispatch({ type: 'ADD_TOAST', toast: newToast });

    // Auto-dismiss after duration
    setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', id });
      // Remove from DOM after animation
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id });
      }, 200);
    }, newToast.duration);
  };

  // Manually dismiss a toast
  const dismiss = (id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id });
    }, 200);
  };

  // Success toast helper
  const success = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: 'success',
    });
  };

  // Error toast helper
  const error = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: 'destructive',
      duration: 7000, // Longer duration for errors
    });
  };

  const value: ToastContextType = {
    toasts: state.toasts,
    toast,
    dismiss,
    success,
    error,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// Hook to use the toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export types for external use
export type { Toast, ToastContextType };
