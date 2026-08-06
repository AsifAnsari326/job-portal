import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Job } from '../../../core/models/job';
import { JobService } from '../../../core/services/job';
import { SavedJobsService } from '../../../core/services/saved-jobs';
import { JobsListing } from './jobs-listing';

describe('JobsListing', () => {
  let component: JobsListing;
  let fixture: ComponentFixture<JobsListing>;
  let jobService: jasmine.SpyObj<JobService>;

  beforeEach(async () => {
    jobService = jasmine.createSpyObj<JobService>('JobService', ['getJobs']);
    jobService.getJobs.and.returnValues(
      of([
        { id: 1, title: 'First', company: 'Acme', location: 'Remote', type: 'Full-time', experience: '1-3', salary: '$100k', tags: ['Angular'] },
        { id: 2, title: 'Second', company: 'Acme', location: 'Remote', type: 'Full-time', experience: '1-3', salary: '$110k', tags: ['React'] },
      ] as Job[]),
      of([
        { id: 3, title: 'Third', company: 'Acme', location: 'Remote', type: 'Full-time', experience: '1-3', salary: '$120k', tags: ['Node'] },
      ] as Job[]),
    );

    const savedJobsService = jasmine.createSpyObj<SavedJobsService>('SavedJobsService', ['toggleJob', 'isSaved']);
    savedJobsService.isSaved.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [JobsListing],
      providers: [
        { provide: JobService, useValue: jobService },
        { provide: SavedJobsService, useValue: savedJobsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsListing);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append jobs when loading more pages', async () => {
    component.loadMore();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.jobs().map((job) => job.id)).toEqual([1, 2, 3]);
  });
});
