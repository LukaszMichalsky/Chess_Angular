import { TestBed } from '@angular/core/testing';

import { AppLogicService } from './app-logic.service';

describe('AppLogicService', () => {
  let service: AppLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
