import { TestBed } from '@angular/core/testing';
import { Authentication } from './services/authentication';

describe('Authentication', () => {
  let service: Authentication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Authentication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
