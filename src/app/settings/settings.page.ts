import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerConfig } from '../core/services/server-config';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  serverAddress = '';
  saved = false;

  constructor(
    private readonly serverConfig: ServerConfig,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.serverAddress = this.serverConfig.getBaseUrl();
  }

  save(): void {
    this.serverConfig.setBaseUrl(this.serverAddress);
    this.saved = true;
    this.cdr.detectChanges();
  }

  onAddressChange(): void {
    this.saved = false;
  }

  back(): void {
    this.router.navigateByUrl('/login');
  }
}
