import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { Job } from '../../core/models/job';
import { SavedJobsService } from '../../core/services/saved-jobs';
import { JobService } from '../../core/services/job';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  templateUrl: './saved-jobs.html',
  styleUrls: ['./saved-jobs.scss'],
})
export class SavedJobsPage {
  private savedJobsService = inject(SavedJobsService);
  private jobService = inject(JobService);

  loading = signal<boolean>(false);

  private savedJobIds$ = toObservable(this.savedJobsService.savedJobIds);

  private savedJobs$ = this.savedJobIds$.pipe(
    switchMap((ids) => {
      if (ids.length === 0) return of([] as Job[]);
      this.loading.set(true);
      return combineLatest(ids.map((id) => this.jobService.getJobById(id))).pipe(
        map((jobs) => {
          this.loading.set(false);
          return jobs;
        }),
      );
    }),
  );

  savedJobs = toSignal(this.savedJobs$, { initialValue: [] as Job[] });

  toggleSave(jobId: number): void {
    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobsService.isSaved(jobId);
  }
}
