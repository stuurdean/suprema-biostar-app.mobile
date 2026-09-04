import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { portalGuard } from './core/guards/portal-guard';

const routes: Routes = [
  {
    // Login.page redirects an already-authenticated user onward to their role's home.
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'tabs',
    canActivate: [portalGuard],
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'desktop',
    canActivate: [adminGuard],
    loadChildren: () => import('./desktop/desktop-tabs/desktop-tabs.module').then((m) => m.DesktopTabsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
