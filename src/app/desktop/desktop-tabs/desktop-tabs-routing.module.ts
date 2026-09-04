import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesktopTabsPage } from './desktop-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: DesktopTabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardPageModule),
      },
      {
        path: 'devices',
        loadChildren: () => import('../devices/device-list/device-list.module').then((m) => m.DeviceListPageModule),
      },
      {
        path: 'users',
        loadChildren: () => import('../users/user-list/user-list.module').then((m) => m.UserListPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('../admin-profile/admin-profile.module').then((m) => m.AdminProfilePageModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'users/new',
    loadChildren: () => import('../users/user-form/user-form.module').then((m) => m.UserFormPageModule),
  },
  {
    path: 'logs',
    loadChildren: () => import('../logs/log-list/log-list.module').then((m) => m.LogListPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesktopTabsPageRoutingModule {}
