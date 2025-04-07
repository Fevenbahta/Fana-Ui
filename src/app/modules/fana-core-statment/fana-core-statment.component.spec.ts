import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanaCoreStatmentComponent } from './fana-core-statment.component';

describe('FanaCoreStatmentComponent', () => {
  let component: FanaCoreStatmentComponent;
  let fixture: ComponentFixture<FanaCoreStatmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanaCoreStatmentComponent]
    });
    fixture = TestBed.createComponent(FanaCoreStatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
