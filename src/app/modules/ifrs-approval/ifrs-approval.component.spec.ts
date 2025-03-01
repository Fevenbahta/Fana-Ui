import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IFRSApprovalComponent } from './ifrs-approval.component';

describe('IFRSApprovalComponent', () => {
  let component: IFRSApprovalComponent;
  let fixture: ComponentFixture<IFRSApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IFRSApprovalComponent]
    });
    fixture = TestBed.createComponent(IFRSApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
