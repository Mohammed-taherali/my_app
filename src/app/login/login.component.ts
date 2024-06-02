import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../spinner/spinner.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  alertService: AlertService = inject(AlertService)
  fb = inject(FormBuilder);
  lf = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })
  showSpinner: boolean = false;

  onSubmit() {
    this.showSpinner = true
    if (!this.lf.valid) {
      this.alertService.showAlert("error", "Please fill in all the fields!")
    }
    const rawForm = this.lf.getRawValue()
    this.authService.loginUser(rawForm.email, rawForm.password)
  }
}
