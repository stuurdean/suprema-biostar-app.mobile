import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogListPage } from './log-list.page';

describe('LogListPage', () => {
  let component: LogListPage;
  let fixture: ComponentFixture<LogListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
