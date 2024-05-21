import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  authService = inject(AuthService)

  ngOnInit() {
    // this.authService.user$.subscribe((user) => {
    //   if (user) {
    //     this.authService.currentUserSig.set({
    //       email: user.email!,
    //       username: user.displayName!
    //     })
    //   } else { 
    //     this.authService.currentUserSig.set(null)
    //   }
    //   console.log(this.authService.currentUserSig());
    // })
  }
  title = 'my_app';
}
