import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAprovalComponent } from './transfer-aproval.component';

describe('TransferAprovalComponent', () => {
  let component: TransferAprovalComponent;
  let fixture: ComponentFixture<TransferAprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferAprovalComponent]
    });
    fixture = TestBed.createComponent(TransferAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
