import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationRecord {
  id: number;
  jobId: number;
  userId: number;
  resumeLink: string;
  coverNote: string;
  appliedDate: string;
}

@Service()
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/applications`;

  getApplications(userId: number): Observable<ApplicationRecord[]> {
    return this.http.get<ApplicationRecord[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createApplication(payload: Omit<ApplicationRecord, 'id'>): Observable<ApplicationRecord> {
    return this.http.post<ApplicationRecord>(this.apiUrl, payload);
  }
}
