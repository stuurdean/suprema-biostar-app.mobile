import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopTabsPage } from './desktop-tabs.page';

describe('DesktopTabsPage', () => {
  let component: DesktopTabsPage;
  let fixture: ComponentFixture<DesktopTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
