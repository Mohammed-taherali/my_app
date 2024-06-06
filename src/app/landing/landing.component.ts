import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  authService: AuthService = inject(AuthService)
  router: Router = inject(Router)
  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("user is present: ", user);
        this.router.navigateByUrl("/dashboard/home")
      } else {
        console.log("user is not present: ", user);
      }
    })
  }
}
