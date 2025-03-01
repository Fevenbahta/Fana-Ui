import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanaAccountStatementComponent } from './fana-account-statement.component';

describe('FanaAccountStatementComponent', () => {
  let component: FanaAccountStatementComponent;
  let fixture: ComponentFixture<FanaAccountStatementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanaAccountStatementComponent]
    });
    fixture = TestBed.createComponent(FanaAccountStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
