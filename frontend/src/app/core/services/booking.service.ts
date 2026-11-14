import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/bookings';

  getBookings(status?: string): Observable<Booking[]> {
    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    return this.http.get<Booking[]>(this.baseUrl, { params });
  }

  confirmBooking(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/confirm`, {});
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
