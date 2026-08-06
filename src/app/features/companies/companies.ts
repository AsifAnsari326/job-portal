import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { CompanyService, Company } from '../../core/services/company';
import { JobService } from '../../core/services/job';
import { Job } from '../../core/models/job';
import { Router, RouterLink } from '@angular/router';
import { SavedJobsService } from '../../core/services/saved-jobs';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies {
  private companyService = CompanyService();
  private jobService = inject(JobService);
  private savedJobsService = inject(SavedJobsService);
  private router = inject(Router);

  companies = signal<Company[]>([]);
  selectedCompany = signal<Company | null>(null);
  companyJobs = signal<Job[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  constructor() {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany.set(company);
    this.loading.set(true);
    this.jobService.getJobs('', '').subscribe({
      next: (allJobs) => {
        // Filter jobs by company name
        const filtered = allJobs.filter((job) => job.company === company.name);
        this.companyJobs.set(filtered);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  clearSelection(): void {
    this.selectedCompany.set(null);
    this.companyJobs.set([]);
  }

  toggleSave(jobId: number): void {
    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobsService.isSaved(jobId);
  }

  navigateToDashboard(): void{
    this.router.navigate(['/dashboard']);
 }
}
