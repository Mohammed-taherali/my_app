import { TestBed } from '@angular/core/testing';

import { DbManagementService } from './db-management.service';

describe('DbManagementService', () => {
  let service: DbManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
