import { Injectable, signal } from '@angular/core';
import { ToastItem, ToastType } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly toasts = signal<ToastItem[]>([]);

  show(type: ToastType, message: string, title?: string, duration: number = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const toast: ToastItem = {
      id,
      type,
      message,
      title,
      duration,
    };
    this.toasts.update((current) => [...current, toast]);
  }

  showSuccess(message: string, title: string = 'Sikeres művelet', duration?: number): void {
    this.show('success', message, title, duration);
  }

  showError(message: string, title: string = 'Hiba történt', duration?: number): void {
    this.show('error', message, title, duration);
  }

  showInfo(message: string, title?: string, duration?: number): void {
    this.show('info', message, title, duration);
  }

  showWarning(message: string, title: string = 'Figyelmeztetés', duration?: number): void {
    this.show('warning', message, title, duration);
  }

  remove(id: string): void {
    this.toasts.update((items) => items.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
