import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';
import { SavedJobsService } from '../../../core/services/saved-jobs';
import { Auth } from '../../../core/services/auth';
import { ApplicationService } from '../../../core/services/application';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, Header],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss',
})
export class JobDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private savedJobsService = inject(SavedJobsService);
  private authService = inject(Auth);
  private applicationService = inject(ApplicationService);
  private fb = inject(FormBuilder);

  readonly job = signal<Job | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly submitted = signal(false);
  readonly hasApplied = signal(false);
  readonly feedbackMessage = signal<string | null>(null);
  readonly feedbackType = signal<'success' | 'error' | 'info'>('success');

  readonly applicationForm = this.fb.group({
    resumeLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
    coverNote: ['', [Validators.required, Validators.minLength(20)]],
  });

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

  private setFeedback(message: string | null, type: 'success' | 'error' | 'info' = 'info'): void {
    this.feedbackMessage.set(message);
    this.feedbackType.set(type);
  }

  openApply(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.setFeedback(null);
    this.showForm.set(true);
  }

  submitApplication(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      this.setFeedback('Please add a valid resume link and a cover note with at least 20 characters.', 'error');
      return;
    }

    const user = this.authService.getCurrentUser();
    const currentJob = this.job();
    if (!user || !currentJob) {
      return;
    }

    this.applicationService.getApplications(user.id).subscribe({
      next: (applications) => {
        const alreadyApplied = applications.some((application) => application.jobId === currentJob.id);
        if (alreadyApplied) {
          this.hasApplied.set(true);
          this.submitted.set(false);
          this.showForm.set(false);
          this.setFeedback('You have already applied to this role.', 'info');
          return;
        }

        const payload = {
          jobId: currentJob.id,
          userId: user.id,
          resumeLink: this.applicationForm.value.resumeLink!,
          coverNote: this.applicationForm.value.coverNote!,
          appliedDate: new Date().toISOString().split('T')[0],
        };

        this.applicationService.createApplication(payload).subscribe({
          next: () => {
            this.submitted.set(true);
            this.showForm.set(false);
            this.hasApplied.set(true);
            this.setFeedback('Application submitted successfully. Good luck!', 'success');
          },
          error: () => {
            this.submitted.set(false);
            this.setFeedback('We could not submit your application right now. Please try again.', 'error');
          },
        });
      },
    });
  }
}
