import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FanaCustomViewComponent } from './fana-custom-view.component';

describe('FanaCustomViewComponent', () => {
  let component: FanaCustomViewComponent;
  let fixture: ComponentFixture<FanaCustomViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FanaCustomViewComponent]
    });
    fixture = TestBed.createComponent(FanaCustomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
