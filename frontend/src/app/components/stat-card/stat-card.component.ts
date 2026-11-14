import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatAccent = 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly title = input<string>('');
  readonly value = input<number | string>(0);
  readonly subtext = input<string | null>(null);
  readonly accent = input<StatAccent>('indigo');
  readonly clickable = input<boolean>(false);
  readonly active = input<boolean>(false);

  readonly cardClick = output<void>();

  protected readonly containerClasses = computed(() => {
    const base = 'relative overflow-hidden bg-white dark:bg-slate-900 border border-white dark:border-slate-900 rounded-2xl p-5 sm:p-6 transition-all duration-200 select-none';
    const activeState = this.active()
      ? 'shadow-md ring-0'
      : 'shadow-xs hover:shadow-md';
    const interact = this.clickable() ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]' : '';

    return `${base} ${activeState} ${interact}`.trim();
  });

  protected readonly valueClasses = computed(() => {
    const colors: Record<StatAccent, string> = {
      indigo: 'text-slate-900 dark:text-white',
      emerald: 'text-emerald-700 dark:text-emerald-400',
      amber: 'text-amber-700 dark:text-amber-400',
      rose: 'text-rose-700 dark:text-rose-400',
      slate: 'text-slate-900 dark:text-white',
    };
    return `text-3xl sm:text-4xl font-bold tracking-tight mt-2 ${colors[this.accent()]}`;
  });

  handleClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }
}
