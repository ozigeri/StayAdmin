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
    const base = 'relative overflow-hidden bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-200 select-none';
    const border = this.active()
      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
      : 'border-slate-200/80 shadow-xs hover:border-slate-300';
    const interact = this.clickable() ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]' : '';

    return `${base} ${border} ${interact}`.trim();
  });

  protected readonly accentIndicatorClasses = computed(() => {
    const accents: Record<StatAccent, string> = {
      indigo: 'bg-indigo-500',
      emerald: 'bg-emerald-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      slate: 'bg-slate-400',
    };
    return `absolute top-0 left-0 right-0 h-1 ${accents[this.accent()]}`;
  });

  protected readonly valueClasses = computed(() => {
    const colors: Record<StatAccent, string> = {
      indigo: 'text-slate-900',
      emerald: 'text-emerald-700',
      amber: 'text-amber-700',
      rose: 'text-rose-700',
      slate: 'text-slate-900',
    };
    return `text-3xl sm:text-4xl font-bold tracking-tight mt-2 ${colors[this.accent()]}`;
  });

  handleClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }
}
