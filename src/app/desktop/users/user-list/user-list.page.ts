import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { AdminUser } from '../../../core/services/admin-user';
import { AdminAppUser } from '../../../shared/models/admin-user.model';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  users: AdminAppUser[] = [];
  filteredUsers: AdminAppUser[] = [];
  searchTerm = '';
  isLoading = true;
  errorMessage = '';

  syncingUserId: number | null = null;
  syncMessage = '';

  constructor(
    private readonly userService: AdminUser,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load users.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRefresh(event: RefresherCustomEvent): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.applySearch();
        event.target.complete();
      },
      error: () => {
        this.errorMessage = 'Could not load users.';
        event.target.complete();
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applySearch();
  }

  syncUser(user: AdminAppUser, event: Event): void {
    event.stopPropagation();

    if (this.syncingUserId) {
      return;
    }

    this.syncingUserId = user.id;
    this.syncMessage = '';
    this.cdr.detectChanges();

    this.userService.syncToDevices(user.id).subscribe({
      next: (result) => {
        this.syncingUserId = null;
        this.syncMessage =
          result.deviceCount === 0
            ? `${user.name}: no devices are currently connected.`
            : `${user.name}: synced to ${result.successCount}/${result.deviceCount} device(s).`;
        this.cdr.detectChanges();
      },
      error: () => {
        this.syncingUserId = null;
        this.syncMessage = `Could not sync ${user.name} — try again.`;
        this.cdr.detectChanges();
      },
    });
  }

  private applySearch(): void {
    const lower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.userId.toLowerCase().includes(lower)
    );
  }
}
