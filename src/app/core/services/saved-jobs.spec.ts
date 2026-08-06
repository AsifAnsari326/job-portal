import { TestBed } from '@angular/core/testing';
import { SavedJobsService } from './saved-jobs';

describe('SavedJobsService', () => {
  let service: SavedJobsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedJobsService);
  });

  it('should toggle a job id and persist it', () => {
    expect(service.isSaved(42)).toBeFalse();

    const wasSaved = service.toggleJob(42);

    expect(wasSaved).toBeTrue();
    expect(service.isSaved(42)).toBeTrue();
    expect(localStorage.getItem('savedJobs')).toContain('42');
  });
});
