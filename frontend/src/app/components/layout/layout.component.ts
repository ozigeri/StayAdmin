import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent } from '../toast/toast.component';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from '../../state/auth/auth.actions';
import { selectAuthUser } from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly store = inject(Store);
  private readonly notificationService = inject(NotificationService);

  private readonly authUser = this.store.selectSignal(selectAuthUser);

  protected readonly sidebarOpen = signal<boolean>(false);
  protected readonly username = computed(() => this.authUser()?.username || 'Admin');
  protected readonly toasts = this.notificationService.toasts;

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  handleLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  removeToast(id: string): void {
    this.notificationService.remove(id);
  }
}
