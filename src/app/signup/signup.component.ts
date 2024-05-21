import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  _router = inject(Router)

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })
  onSubmit() {
    const rawForm = this.form.getRawValue()
    this.authService.registerUser(rawForm.username, rawForm.email, rawForm.password).subscribe(() => {
      this._router.navigateByUrl("/")
    })
  }
}
