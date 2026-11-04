import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LeadType } from '../data/lead-config';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);

  submit(type: LeadType, data: Record<string, unknown>) {
    return this.http.post<{ ok: boolean }>('/api/leads', { type, data });
  }
}
