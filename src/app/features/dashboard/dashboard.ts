import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';
import { Job } from '../../core/models/job';
import { SavedJobsService } from '../../core/services/saved-jobs';
import { JobService } from '../../core/services/job';
import { Auth } from '../../core/services/auth';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private savedJobsService = inject(SavedJobsService);
  private jobService = inject(JobService);
  private authService = inject(Auth);

  loading = signal<boolean>(false);
  userName = signal<string>('User');
  
  // Saved jobs stream
  private savedJobIds$ = toObservable(this.savedJobsService.savedJobIds);

  private savedJobs$ = this.savedJobIds$.pipe(
    switchMap((ids) => {
      if (ids.length === 0) return of([] as Job[]);
      this.loading.set(true);
      // Fetch full job details for each saved ID (limit to 6 for dashboard preview)
      const limitedIds = ids.slice(0, 6);
      return combineLatest(limitedIds.map((id) => this.jobService.getJobById(id))).pipe(
        map((jobs) => {
          this.loading.set(false);
          return jobs;
        }),
      );
    }),
  );

  recentSavedJobs = toSignal(this.savedJobs$, { initialValue: [] as Job[] });
  savedJobsCount = toSignal(
    toObservable(this.savedJobsService.savedJobIds).pipe(map((ids) => ids.length)),
    { initialValue: 0 },
  );

  // Applied jobs (placeholder)
  appliedJobsCount = signal<number>(0);
  recentApplications = signal<any[]>([]);

  constructor() {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName.set(user.fullName || 'User');
    }
    // TODO: Load applied jobs from API when applications endpoint is ready
  }

  toggleSave(jobId: number): void {
    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobsService.isSaved(jobId);
  }
}

