import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogListPageRoutingModule } from './log-list-routing.module';

import { LogListPage } from './log-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogListPageRoutingModule
  ],
  declarations: [LogListPage]
})
export class LogListPageModule {}
