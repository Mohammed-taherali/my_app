import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: "", component: HomeComponent, canActivate: [authGuard] },
    { path: "home", component: HomeComponent, canActivate: [authGuard] },
    { path: "signup", component: SignupComponent },
    { path: "login", component: LoginComponent },
];
