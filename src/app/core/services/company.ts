import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  jobCount?: number;
}

export function CompanyService() {
  const http = inject(HttpClient);
  const apiUrl = environment.apiUrl;

  return {
    getCompanies(): Observable<Company[]> {
      return http.get<Company[]>(`${apiUrl}/companies`);
    },

    getCompanyJobs(companyId: number): Observable<any[]> {
      return http.get<any[]>(`${apiUrl}/jobs?companyId=${companyId}`);
    },
  };
}
