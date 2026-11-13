import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly customClass = input<string>('');

  readonly clicked = output<MouseEvent>();

  protected readonly buttonClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none';

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow focus:ring-indigo-500 border border-transparent',
      secondary:
        'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus:ring-slate-900 border border-transparent',
      outline:
        'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400 shadow-xs',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
      danger:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:shadow focus:ring-rose-500 border border-transparent',
      subtle:
        'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-300 border border-indigo-100',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `${base} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${widthClass} ${this.customClass()}`.trim();
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
