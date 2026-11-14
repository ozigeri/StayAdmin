import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Property,
  PropertyListItem,
  PropertyDto,
  PropertyOverview,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/properties';

  getProperties(name?: string, category?: string): Observable<PropertyListItem[]> {
    let params = new HttpParams();
    if (name && name.trim()) {
      params = params.set('name', name.trim());
    }
    if (category && category.trim()) {
      params = params.set('category', category.trim());
    }
    return this.http.get<PropertyListItem[]>(this.baseUrl, { params });
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  createProperty(dto: PropertyDto): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, dto);
  }

  updateProperty(id: string, dto: PropertyDto): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, dto);
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPropertyOverview(id: string): Observable<PropertyOverview> {
    return this.http.get<PropertyOverview>(`${this.baseUrl}/${id}/overview`);
  }
}
