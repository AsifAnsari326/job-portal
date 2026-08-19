import { Component, inject, signal } from '@angular/core';
import { Job } from '../../core/models/job';
import { SavedJobsService } from '../../core/services/saved-jobs';
import { JobService } from '../../core/services/job';
import { Auth } from '../../core/services/auth';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../core/services/application';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private savedJobsService = inject(SavedJobsService);
  private jobService = inject(JobService);
  private authService = inject(Auth);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal<boolean>(false);
  userName = signal<string>('User');
  activeTab = signal<'saved' | 'applications'>('saved');
  savedJobs = signal<Job[]>([]);
  appliedJobs = signal<Array<{ job: Job; application: any }>>([]);
  applicationsLoading = signal(false);

  private savedJobIds$ = toObservable(this.savedJobsService.savedJobIds);

  private savedJobs$ = this.savedJobIds$.pipe(
    switchMap((ids) => {
      if (ids.length === 0) {
        this.savedJobs.set([]);
        return of([] as Job[]);
      }
      this.loading.set(true);
      const limitedIds = ids.slice(0, 12);
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

  appliedJobsCount = signal<number>(0);

  constructor() {
    this.loadUserData();
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      this.activeTab.set(tab === 'applications' ? 'applications' : 'saved');
    });
    this.savedJobs$.subscribe((jobs) => this.savedJobs.set(jobs));
    this.loadApplications();
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName.set(user.fullname || 'User');
    }
  }

  loadApplications(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.appliedJobs.set([]);
      this.appliedJobsCount.set(0);
      return;
    }
    this.applicationsLoading.set(true);
    this.applicationService.getApplications(user.id).subscribe({
      next: (applications) => {
        const jobs$ = applications.map((application) => this.jobService.getJobById(application.jobId).pipe(map((job) => ({ job, application }))));
        if (jobs$.length === 0) {
          this.appliedJobs.set([]);
          this.appliedJobsCount.set(0);
          this.applicationsLoading.set(false);
          return;
        }
        combineLatest(jobs$).subscribe({
          next: (items) => {
            this.appliedJobs.set(items);
            this.appliedJobsCount.set(items.length);
            this.applicationsLoading.set(false);
          },
          error: () => {
            this.appliedJobs.set([]);
            this.appliedJobsCount.set(0);
            this.applicationsLoading.set(false);
          },
        });
      },
      error: () => {
        this.appliedJobs.set([]);
        this.appliedJobsCount.set(0);
        this.applicationsLoading.set(false);
      },
    });
  }

  toggleSave(jobId: number): void {
    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobsService.isSaved(jobId);
  }

  setTab(tab: 'saved' | 'applications'): void {
    this.activeTab.set(tab);
    this.router.navigate([], { queryParams: { tab }, queryParamsHandling: 'merge' });
  }
}

