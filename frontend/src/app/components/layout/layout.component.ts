import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent, ToastItem } from '../toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal<boolean>(false);
  protected readonly username = signal<string>('Admin');
  protected readonly toasts = signal<ToastItem[]>([]);

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  handleLogout(): void {
    localStorage.removeItem('stayadmin_token');
    localStorage.removeItem('stayadmin_user');
    this.router.navigate(['/login']);
  }

  removeToast(id: string): void {
    this.toasts.update((items) => items.filter((t) => t.id !== id));
  }
}
