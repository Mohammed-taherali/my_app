import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatSidenavModule, MatExpansionModule, CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  username: string = ""

  public isMenuOpen: boolean = false;
  openedsideTab: string = "";

  ngOnInit() {
    this.username = this.authService.username
  }

  public onSidenavClick(): void {
    this.isMenuOpen = false;
  }

  goTo(path: string) {
    this.isMenuOpen = false;
    this.openedsideTab = '';
    this.router.navigateByUrl(path)
  }

  logoutUser() {
    this.authService.logoutUser();
    this.router.navigateByUrl("/login")
  }
}
