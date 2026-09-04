import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceListPage } from './device-list.page';

describe('DeviceListPage', () => {
  let component: DeviceListPage;
  let fixture: ComponentFixture<DeviceListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
