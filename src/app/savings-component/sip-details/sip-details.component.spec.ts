import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipDetailsComponent } from './sip-details.component';

describe('SipDetailsComponent', () => {
  let component: SipDetailsComponent;
  let fixture: ComponentFixture<SipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SipDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
