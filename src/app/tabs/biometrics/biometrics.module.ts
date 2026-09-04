import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BiometricsPageRoutingModule } from './biometrics-routing.module';

import { BiometricsPage } from './biometrics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    BiometricsPageRoutingModule
  ],
  declarations: [BiometricsPage]
})
export class BiometricsPageModule {}
