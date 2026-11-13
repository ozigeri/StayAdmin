import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type ModalVariant = 'primary' | 'danger' | 'warning';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('Megerősítés');
  readonly message = input<string>('Biztosan végrehajtja a műveletet?');
  readonly confirmText = input<string>('Igen, megerősítem');
  readonly cancelText = input<string>('Mégse');
  readonly variant = input<ModalVariant>('primary');
  readonly loading = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen() && !this.loading()) {
      this.cancelled.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.loading()) {
      this.cancelled.emit();
    }
  }

  handleConfirm(): void {
    this.confirmed.emit();
  }

  handleCancel(): void {
    this.cancelled.emit();
  }
}
