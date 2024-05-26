import { TestBed } from '@angular/core/testing';

import { SavingsManagementService } from './savings-management.service';

describe('SavingsManagementService', () => {
  let service: SavingsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavingsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
