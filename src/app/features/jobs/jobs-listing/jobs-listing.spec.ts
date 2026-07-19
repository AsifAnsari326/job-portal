import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsListing } from './jobs-listing';

describe('JobsListing', () => {
  let component: JobsListing;
  let fixture: ComponentFixture<JobsListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsListing],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
