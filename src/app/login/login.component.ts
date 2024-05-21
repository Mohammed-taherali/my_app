import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  _router = inject(Router)

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  onSubmit() {
    const rawForm = this.form.getRawValue()
    this.authService.loginUser(rawForm.email, rawForm.password).subscribe(() => {
      this._router.navigateByUrl("/")
    })
  }
}
