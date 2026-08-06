import { Component, inject } from '@angular/core';
import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';
import { SavedJobsService } from '../../../core/services/saved-jobs';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs-listing',
  standalone: true,
  imports: [RouterLink],
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

  private search$ = toObservable(this.searchTerm).pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  private type$ = toObservable(this.typeFilter);
  private experience$ = toObservable(this.experienceFilter);

  private jobs$ = combineLatest([this.search$, this.type$, this.experience$]).pipe(
    tap(() => {
      this.loading.set(true);
      this.error.set(false);
    }),
    switchMap(([term, type, experience]) =>
      this.jobService.getJobs(term, type).pipe(
        map((allJobs) => {
          // Filter by experience levels if any are selected
          if (experience.length > 0) {
            return allJobs.filter((job) => experience.includes(job.experience));
          }
          return allJobs;
        }),
        catchError(() => {
          this.error.set(true);
          return of([] as Job[]);
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
  }

  onTypeChange(value: string): void {
    this.typeFilter.set(value);
  }

  onExperienceChange(value: string, checked: boolean): void {
    const currentFilters = this.experienceFilter();
    if (checked) {
      this.experienceFilter.set([...currentFilters, value]);
    } else {
      this.experienceFilter.set(currentFilters.filter((exp) => exp !== value));
    }
  }

  onClearFilters(): void {
    this.searchTerm.set('');
    this.typeFilter.set('');
    this.experienceFilter.set([]);
  }
}