import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, SpinnerComponent, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  _router = inject(Router)
  showSpinner: boolean = false;
  currentYear: number;

  constructor() {
    this.currentYear = (new Date()).getFullYear()
  }

  sf = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', Validators.required],
  })
  onSubmit() {
    this.showSpinner = true
    const rawForm = this.sf.getRawValue()
    this.authService.registerUser(rawForm.username, rawForm.email, rawForm.password).then((response) => {
      console.log("response: ", response);
      if (response === true) {
        this._router.navigateByUrl("/dashboard/home")
      } else {
        this.showSpinner = false
      }
    })
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
  }
}
