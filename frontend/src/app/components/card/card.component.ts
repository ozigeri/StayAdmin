import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly padding = input<CardPadding>('md');
  readonly hoverable = input<boolean>(false);
  readonly customClass = input<string>('');

  protected readonly cardClasses = computed(() => {
    const base = 'bg-white dark:bg-slate-900 border border-white dark:border-slate-900 rounded-2xl shadow-xs text-slate-900 dark:text-slate-100 transition-all duration-200';
    const hover = this.hoverable() ? 'hover:shadow-md hover:-translate-y-0.5' : '';
    return `${base} ${hover} ${this.customClass()}`.trim();
  });

  protected readonly paddingClasses = computed(() => {
    const map: Record<CardPadding, string> = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-5 sm:p-6',
      lg: 'p-6 sm:p-8',
    };
    return map[this.padding()];
  });
}
