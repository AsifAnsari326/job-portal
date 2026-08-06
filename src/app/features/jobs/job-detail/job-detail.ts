import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';
import { SavedJobsService } from '../../../core/services/saved-jobs';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetail {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private savedJobsService = inject(SavedJobsService);

  readonly job = signal<Job | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        filter((id): id is number => !Number.isNaN(id)),
        switchMap((id) => {
          this.loading.set(true);
          this.error.set(false);
          return this.jobService.getJobById(id).pipe(
            tap((job) => {
              this.job.set(job);
            }),
            catchError(() => {
              this.error.set(true);
              return of(null as Job | null);
            }),
          );
        }),
      )
      .subscribe(() => {
        this.loading.set(false);
      });
  }

  toggleSave(jobId: number | undefined): void {
    if (!jobId) {
      return;
    }

    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number | undefined): boolean {
    return !!jobId && this.savedJobsService.isSaved(jobId);
  }
}
