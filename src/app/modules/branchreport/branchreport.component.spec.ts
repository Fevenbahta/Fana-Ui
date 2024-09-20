import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchreportComponent } from './branchreport.component';

describe('BranchreportComponent', () => {
  let component: BranchreportComponent;
  let fixture: ComponentFixture<BranchreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchreportComponent]
    });
    fixture = TestBed.createComponent(BranchreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
