import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'search'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'logout'
  | 'building'
  | 'calendar'
  | 'check'
  | 'x'
  | 'user'
  | 'chevron-down'
  | 'image'
  | 'clock'
  | 'home'
  | 'arrow-left'
  | 'refresh'
  | 'map-pin'
  | 'bed'
  | 'sun'
  | 'moon';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<IconSize>('md');
  readonly customClass = input<string>('');

  protected readonly iconClasses = computed(() => {
    const sizeMap: Record<IconSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    };
    return `shrink-0 ${sizeMap[this.size()]} ${this.customClass()}`.trim();
  });
}
