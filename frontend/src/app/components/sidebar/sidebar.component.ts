import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Áttekintés', path: '/overview', icon: 'home' },
    { label: 'Szálláshelyek', path: '/properties', icon: 'building' },
    { label: 'Foglalások', path: '/bookings', icon: 'calendar' },
  ];

  handleNavigate(): void {
    this.close.emit();
  }
}
