import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  readonly username = input<string>('admin');

  readonly logout = output<void>();
  readonly toggleSidebar = output<void>();

  protected readonly isDark = this.themeService.isDark;

  handleLogout(): void {
    this.logout.emit();
  }

  handleToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
