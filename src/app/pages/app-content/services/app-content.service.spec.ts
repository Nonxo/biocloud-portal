import { TestBed, inject } from '@angular/core/testing';

import { AppContentService } from './app-content.service';

describe('AppContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppContentService]
    });
  });

  it('should be created', inject([AppContentService], (service: AppContentService) => {
    expect(service).toBeTruthy();
  }));
});
