export enum EBookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
}

export interface Booking {
  id: string;
  guestName: string;
  propertyId?: string;
  propertyName: string;
  start: string;
  end: string;
  status: EBookingStatus;
  createdAt?: string;
}

export interface BookingSummary {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}

export type BookingStatusFilter = 'All' | EBookingStatus;
