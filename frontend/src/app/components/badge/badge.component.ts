import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'hotel'
  | 'pension'
  | 'apartment'
  | 'guesthouse'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly text = input<string | null>(null);
  readonly dot = input<boolean>(true);
  readonly size = input<BadgeSize>('md');

  protected readonly badgeClasses = computed(() => {
    const base = 'inline-flex items-center font-medium rounded-full select-none transition-colors';

    const sizeClasses: Record<BadgeSize, string> = {
      sm: 'text-[11px] px-2 py-0.5 gap-1',
      md: 'text-xs px-2.5 py-1 gap-1.5',
    };

    const variantClasses: Record<BadgeVariant, string> = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      cancelled: 'bg-rose-50 text-rose-700 border border-rose-200/80',
      hotel: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
      pension: 'bg-sky-50 text-sky-700 border border-sky-200/80',
      apartment: 'bg-violet-50 text-violet-700 border border-violet-200/80',
      guesthouse: 'bg-teal-50 text-teal-700 border border-teal-200/80',
      neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    };

    return `${base} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`.trim();
  });

  protected readonly dotClasses = computed(() => {
    const dotColors: Record<BadgeVariant, string> = {
      pending: 'bg-amber-500 animate-pulse',
      confirmed: 'bg-emerald-500',
      cancelled: 'bg-rose-500',
      hotel: 'bg-indigo-500',
      pension: 'bg-sky-500',
      apartment: 'bg-violet-500',
      guesthouse: 'bg-teal-500',
      neutral: 'bg-slate-400',
    };

    return `w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[this.variant()]}`;
  });
}
