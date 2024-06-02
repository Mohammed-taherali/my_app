import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSipComponent } from './add-sip.component';

describe('AddSipComponent', () => {
  let component: AddSipComponent;
  let fixture: ComponentFixture<AddSipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
