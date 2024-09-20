import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanaReportComponent } from './fana-report.component';

describe('FanaReportComponent', () => {
  let component: FanaReportComponent;
  let fixture: ComponentFixture<FanaReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanaReportComponent]
    });
    fixture = TestBed.createComponent(FanaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
