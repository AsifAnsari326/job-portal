import { Component, inject, signal } from '@angular/core';
import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';
import { SavedJobsService } from '../../../core/services/saved-jobs';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-jobs-listing',
  standalone: true,
  imports: [RouterLink, Header],
  templateUrl: './jobs-listing.html',
  styleUrl: './jobs-listing.scss',
})
export class JobsListing {
  private jobService = inject(JobService);
  private savedJobsService = inject(SavedJobsService);

  searchTerm = signal<string>('');
  typeFilter = signal<string>('');
  experienceFilter = signal<string[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  page = signal<number>(1);
  hasMore = signal<boolean>(true);
  limit = 6;
  private allJobs = signal<Job[]>([]);

  private search$ = toObservable(this.searchTerm).pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  private type$ = toObservable(this.typeFilter);
  private experience$ = toObservable(this.experienceFilter);

  private jobs$ = combineLatest([this.search$, this.type$, this.experience$, toObservable(this.page)]).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(false);
    }),
    switchMap(([term, type, experience, page]) =>
      this.jobService.getJobs(term, type, page, this.limit).pipe(
        map((allJobs) => {
          const filteredJobs = experience.length > 0
            ? allJobs.filter((job) => experience.includes(job.experience))
            : allJobs;

          if (page === 1) {
            this.allJobs.set(filteredJobs);
          } else {
            this.allJobs.set([...this.allJobs(), ...filteredJobs]);
          }

          this.hasMore.set(filteredJobs.length === this.limit);
          return this.allJobs();
        }),
        catchError(() => {
          this.error.set(true);
          return of(this.allJobs());
        }),
      ),
    ),
    tap(() => this.loading.set(false)),
  );

  jobs = toSignal(this.jobs$, { initialValue: [] as Job[] });

  toggleSave(jobId: number): void {
    this.savedJobsService.toggleJob(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobsService.isSaved(jobId);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
    this.hasMore.set(true);
    this.allJobs.set([]);
  }

  onTypeChange(value: string): void {
    this.typeFilter.set(value);
    this.page.set(1);
    this.hasMore.set(true);
    this.allJobs.set([]);
  }

  onExperienceChange(value: string, checked: boolean): void {
    const currentFilters = this.experienceFilter();
    if (checked) {
      this.experienceFilter.set([...currentFilters, value]);
    } else {
      this.experienceFilter.set(currentFilters.filter((exp) => exp !== value));
    }
    this.page.set(1);
    this.hasMore.set(true);
    this.allJobs.set([]);
  }

  onClearFilters(): void {
    this.searchTerm.set('');
    this.typeFilter.set('');
    this.experienceFilter.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.allJobs.set([]);
  }

  loadMore(): void {
    if (!this.hasMore()) {
      return;
    }
    this.page.set(this.page() + 1);
  }
}