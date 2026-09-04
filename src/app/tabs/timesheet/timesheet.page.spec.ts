import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimesheetPage } from './timesheet.page';

describe('TimesheetPage', () => {
  let component: TimesheetPage;
  let fixture: ComponentFixture<TimesheetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
