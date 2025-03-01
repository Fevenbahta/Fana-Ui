import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IFRSReportComponent } from './ifrs-report.component';

describe('IFRSReportComponent', () => {
  let component: IFRSReportComponent;
  let fixture: ComponentFixture<IFRSReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IFRSReportComponent]
    });
    fixture = TestBed.createComponent(IFRSReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
