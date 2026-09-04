import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then((m) => m.LogsPageModule),
      },
      {
        path: 'timesheet',
        loadChildren: () => import('./timesheet/timesheet.module').then((m) => m.TimesheetPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'biometrics',
        loadChildren: () => import('./biometrics/biometrics.module').then((m) => m.BiometricsPageModule),
      },
      {
        path: '',
        redirectTo: 'logs',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
