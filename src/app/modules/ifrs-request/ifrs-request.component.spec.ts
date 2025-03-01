import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IFRSRequestComponent } from './ifrs-request.component';

describe('IFRSRequestComponent', () => {
  let component: IFRSRequestComponent;
  let fixture: ComponentFixture<IFRSRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IFRSRequestComponent]
    });
    fixture = TestBed.createComponent(IFRSRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
