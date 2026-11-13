import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { BadgeComponent, BadgeVariant } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { Booking, BookingSummary, EBookingStatus, BookingStatusFilter } from '../../core/models';

@Component({
  selector: 'app-bookings-view',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    StatCardComponent,
    BadgeComponent,
    ButtonComponent,
    ModalComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  templateUrl: './bookings-view.component.html',
  styleUrl: './bookings-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsViewComponent {
  protected readonly bookings = signal<Booking[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly selectedFilter = signal<BookingStatusFilter>('All');

  protected readonly isConfirmModalOpen = signal<boolean>(false);
  protected readonly isCancelModalOpen = signal<boolean>(false);
  protected readonly selectedBooking = signal<Booking | null>(null);
  protected readonly actionLoading = signal<boolean>(false);

  protected readonly summary = computed<BookingSummary>(() => {
    const list = this.bookings();
    return {
      total: list.length,
      pending: list.filter((b) => b.status === EBookingStatus.Pending).length,
      confirmed: list.filter((b) => b.status === EBookingStatus.Confirmed).length,
      cancelled: list.filter((b) => b.status === EBookingStatus.Cancelled).length,
    };
  });

  protected readonly filteredBookings = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'All') {
      return this.bookings();
    }
    return this.bookings().filter((b) => b.status === filter);
  });

  setFilter(filter: BookingStatusFilter): void {
    this.selectedFilter.set(filter);
  }

  getBadgeVariant(status: EBookingStatus): BadgeVariant {
    switch (status) {
      case EBookingStatus.Pending:
        return 'pending';
      case EBookingStatus.Confirmed:
        return 'confirmed';
      case EBookingStatus.Cancelled:
        return 'cancelled';
      default:
        return 'neutral';
    }
  }

  getStatusLabel(status: EBookingStatus): string {
    switch (status) {
      case EBookingStatus.Pending:
        return 'Függőben';
      case EBookingStatus.Confirmed:
        return 'Visszaigazolt';
      case EBookingStatus.Cancelled:
        return 'Lemondva';
      default:
        return status;
    }
  }

  promptConfirm(booking: Booking): void {
    this.selectedBooking.set(booking);
    this.isConfirmModalOpen.set(true);
  }

  promptCancel(booking: Booking): void {
    this.selectedBooking.set(booking);
    this.isCancelModalOpen.set(true);
  }

  closeModals(): void {
    this.isConfirmModalOpen.set(false);
    this.isCancelModalOpen.set(false);
    this.selectedBooking.set(null);
  }

  confirmBookingAction(): void {
    this.closeModals();
  }

  cancelBookingAction(): void {
    this.closeModals();
  }
}
