import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconName } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input<string>('Nincs megjeleníthető adat');
  readonly message = input<string>('Próbálja meg módosítani a szűrési feltételeket vagy hozzon létre egy új elemet.');
  readonly icon = input<IconName>('search');
  readonly actionText = input<string | null>(null);

  readonly actionClick = output<void>();

  handleAction(): void {
    this.actionClick.emit();
  }
}
