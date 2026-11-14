import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { CardComponent } from '../../components/card/card.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { BadgeComponent, BadgeVariant } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { IconComponent } from '../../components/icon/icon.component';
import { Booking, EBookingStatus, BookingStatusFilter } from '../../core/models';
import * as BookingsActions from '../../state/bookings/bookings.actions';
import {
  selectBookingActionLoading,
  selectBookingsList,
  selectBookingsLoading,
  selectBookingsSummary,
} from '../../state/bookings/bookings.selectors';

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
export class BookingsViewComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly bookings = this.store.selectSignal(selectBookingsList);
  protected readonly summary = this.store.selectSignal(selectBookingsSummary);
  protected readonly loading = this.store.selectSignal(selectBookingsLoading);
  protected readonly actionLoading = this.store.selectSignal(
    selectBookingActionLoading
  );

  protected readonly selectedFilter = signal<BookingStatusFilter>('All');

  protected readonly isConfirmModalOpen = signal<boolean>(false);
  protected readonly isCancelModalOpen = signal<boolean>(false);
  protected readonly selectedBooking = signal<Booking | null>(null);

  protected readonly filteredBookings = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'All') {
      return this.bookings();
    }
    return this.bookings().filter((b) => b.status === filter);
  });

  ngOnInit(): void {
    this.store.dispatch(BookingsActions.loadBookings({}));
  }

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
    const b = this.selectedBooking();
    if (b) {
      this.store.dispatch(BookingsActions.confirmBooking({ id: b.id }));
    }
    this.closeModals();
  }

  cancelBookingAction(): void {
    const b = this.selectedBooking();
    if (b) {
      this.store.dispatch(BookingsActions.cancelBooking({ id: b.id }));
    }
    this.closeModals();
  }
}
