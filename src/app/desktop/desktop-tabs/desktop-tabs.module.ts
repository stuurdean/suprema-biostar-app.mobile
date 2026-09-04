import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesktopTabsPageRoutingModule } from './desktop-tabs-routing.module';

import { DesktopTabsPage } from './desktop-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesktopTabsPageRoutingModule
  ],
  declarations: [DesktopTabsPage]
})
export class DesktopTabsPageModule {}
