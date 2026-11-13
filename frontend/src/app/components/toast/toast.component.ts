import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {
  readonly id = input<string>(`toast-${Math.random().toString(36).substring(2, 9)}`);
  readonly type = input<ToastType>('info');
  readonly title = input<string | null>(null);
  readonly message = input<string>('');
  readonly duration = input<number>(4000);

  readonly closed = output<string>();

  protected readonly containerClasses = computed(() => {
    const base = 'flex items-start gap-3 w-full max-w-sm p-4 bg-white rounded-2xl shadow-lg border animate-slide-up transition-all';
    const borders: Record<ToastType, string> = {
      success: 'border-emerald-200 text-slate-800',
      error: 'border-rose-200 text-slate-800',
      warning: 'border-amber-200 text-slate-800',
      info: 'border-indigo-200 text-slate-800',
    };
    return `${base} ${borders[this.type()]}`;
  });

  protected readonly iconClasses = computed(() => {
    const icons: Record<ToastType, string> = {
      success: 'bg-emerald-100 text-emerald-600',
      error: 'bg-rose-100 text-rose-600',
      warning: 'bg-amber-100 text-amber-600',
      info: 'bg-indigo-100 text-indigo-600',
    };
    return `shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${icons[this.type()]}`;
  });

  ngOnInit(): void {
    if (this.duration() > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration());
    }
  }

  close(): void {
    this.closed.emit(this.id());
  }
}
