import { Service, signal } from '@angular/core';

@Service()
export class SavedJobsService {
  readonly savedJobIds = signal<number[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  toggleJob(jobId: number): boolean {
    const current = this.savedJobIds();
    const next = current.includes(jobId)
      ? current.filter((id) => id !== jobId)
      : [...current, jobId];

    this.savedJobIds.set(next);
    this.persist();
    return next.includes(jobId);
  }

  isSaved(jobId: number): boolean {
    return this.savedJobIds().includes(jobId);
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('savedJobs');
    if (!stored) {
      this.savedJobIds.set([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as number[];
      this.savedJobIds.set(Array.isArray(parsed) ? parsed : []);
    } catch {
      this.savedJobIds.set([]);
    }
  }

  private persist(): void {
    localStorage.setItem('savedJobs', JSON.stringify(this.savedJobIds()));
  }
}
