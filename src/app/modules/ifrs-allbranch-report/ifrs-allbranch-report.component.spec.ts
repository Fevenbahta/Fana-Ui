import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IFRSAllbranchReportComponent } from './ifrs-allbranch-report.component';

describe('IFRSAllbranchReportComponent', () => {
  let component: IFRSAllbranchReportComponent;
  let fixture: ComponentFixture<IFRSAllbranchReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IFRSAllbranchReportComponent]
    });
    fixture = TestBed.createComponent(IFRSAllbranchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
