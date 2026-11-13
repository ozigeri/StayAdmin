import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly username = input<string>('admin');

  readonly logout = output<void>();
  readonly toggleSidebar = output<void>();

  handleLogout(): void {
    this.logout.emit();
  }

  handleToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
