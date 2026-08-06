import { HttpClient, HttpParams } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Job } from '../models/job';
import { Observable } from 'rxjs';

@Service()
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/jobs';

  getJobs(searchTerm: string = '', type: string = ''): Observable<Job[]> {
    let params = new HttpParams();
    if (searchTerm) params = params.set('q', searchTerm);
    if (type) params = params.set('type', type);
    return this.http.get<Job[]>(this.apiUrl, { params });
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }
}
