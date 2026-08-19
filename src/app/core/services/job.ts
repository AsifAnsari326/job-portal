import { HttpClient, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Job } from '../models/job';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/jobs`;

  getJobs(searchTerm: string = '', type: string = '', page: number = 1, limit: number = 6): Observable<Job[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('q', searchTerm);
    if (type) params = params.set('type', type);
    params = params.set('_page', page.toString());
    params = params.set('_limit', limit.toString());
    return this.http.get<Job[]>(this.apiUrl, { params });
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }
}
