import { Component, inject, signal } from '@angular/core';
import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-jobs-listing',
  standalone: true,
  imports: [],
  templateUrl: './jobs-listing.html',
  styleUrl: './jobs-listing.scss',
})
export class JobsListing {
  jobs = signal<Job[]>([]);
  loading = signal<boolean>(true);
  error= signal<boolean>(false);
  private jobService = inject(JobService)

  constructor() {}

  ngOnInit() {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        console.log('Jobs fetched successfully:', jobs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    })
  }
}
