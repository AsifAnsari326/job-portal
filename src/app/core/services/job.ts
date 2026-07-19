import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Job } from '../models/job';
import { Observable } from 'rxjs';

@Service()
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/jobs';

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl)
  }
}
